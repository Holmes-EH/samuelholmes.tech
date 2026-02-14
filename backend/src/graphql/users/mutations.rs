use argon2::{
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
    password_hash::{SaltString, rand_core::OsRng},
};
use async_graphql::*;
use jsonwebtoken::{Algorithm, EncodingKey, Header, encode};
use sqlx::PgPool;
use uuid::Uuid;
// use uuid::Uuid;

use crate::{
    db::models::DbUser,
    graphql::{
        error::AppError,
        guard::{AuthGuard, Claims},
        users::schema::{CreateUserInput, LoginResponse, UpdateUserInput, User},
    },
};

#[derive(Default)]
pub struct UserMutation;

#[Object]
impl UserMutation {
    async fn create_user(&self, ctx: &Context<'_>, new_user: CreateUserInput) -> Result<User> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let pwd_hash = argon2
            .hash_password(new_user.password.as_bytes(), &salt)
            .map_err(|_| AppError::InternalError("Error hashing password".into()))?
            .to_string();

        let db_user: DbUser = sqlx::query_as::<_, DbUser>(
            r#"
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, password, created_at, updated_at;
            "#,
        )
        .bind(&new_user.name)
        .bind(&new_user.email)
        .bind(pwd_hash)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::Database(db_err) if db_err.constraint() == Some("users_name_key") => {
                AppError::InvalidInput("A user with this name already exists".into())
            }
            sqlx::Error::Database(db_err) => {
                println!("HERE in map_err");
                // Generic unique constraint violation (code 23505)
                if db_err.code().as_deref() == Some("23505") {
                    AppError::InvalidInput("Duplicate value violates unique constraint".into())
                } else {
                    AppError::DatabaseError(db_err.to_string())
                }
            }
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        println!("{:#?}", db_user.password);

        Ok(db_user.into())
    }

    #[graphql(guard = "AuthGuard")]
    async fn update_me(&self, ctx: &Context<'_>, user: UpdateUserInput) -> Result<User> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| "Invalid project ID format")?;

        let user_id_from_ctx = ctx
            .data::<Uuid>()
            .map_err(|_| AppError::Unauthorized("Valid authentication required".into()))?;
        let user_id_from_input = Uuid::parse_str(&user.id)
            .map_err(|_| AppError::InvalidInput("Error parsing user id".into()))?;

        if user_id_from_ctx != &user_id_from_input {
            return Err(AppError::InvalidInput("You cannot update this user".into()).extend());
        }

        let user_from_db: DbUser = sqlx::query_as::<_, DbUser>(
            r#"
            SELECT *
            FROM users
            WHERE id = $1
            "#,
        )
        .bind(user_id_from_ctx)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("User not found".into()),
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        let password = match user.password {
            None => Ok::<String, AppError>(user_from_db.password),
            Some(new_password) => {
                let salt = SaltString::generate(&mut OsRng);
                let argon2 = Argon2::default();
                let pwd_hash = argon2
                    .hash_password(new_password.as_bytes(), &salt)
                    .map_err(|_| AppError::InternalError("Error hashing password".into()))?
                    .to_string();
                Ok(pwd_hash.to_string())
            }
        }?;

        let name = match user.name {
            Some(new_name) => new_name,
            None => user_from_db.name,
        };

        let email = match user.email {
            Some(new_email) => new_email,
            None => user_from_db.email,
        };

        let updated_user: DbUser = sqlx::query_as::<_, DbUser>(
            r#"
            UPDATE users
            SET name = $2, email = $3, password = $4
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(user_id_from_ctx)
        .bind(name)
        .bind(email)
        .bind(password)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::Database(db_err) if db_err.constraint() == Some("projects_title_key") => {
                AppError::InvalidInput("A project with this title already exists".into())
            }
            sqlx::Error::Database(db_err) => {
                // Generic unique constraint violation (code 23505)
                if db_err.code().as_deref() == Some("23505") {
                    AppError::InvalidInput("Duplicate value violates unique constraint".into())
                } else {
                    AppError::DatabaseError(db_err.to_string())
                }
            }
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        Ok(updated_user.into())
    }

    async fn login_user(
        &self,
        ctx: &Context<'_>,
        email: String,
        password: String,
    ) -> Result<LoginResponse> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let db_user: DbUser = sqlx::query_as::<_, DbUser>(
            r#"
            SELECT *
            FROM users
            WHERE email = $1
            "#,
        )
        .bind(&email)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("User not found".into()),
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        let argon2 = Argon2::default();
        let parsed_hash = PasswordHash::new(&db_user.password)?;
        argon2
            .verify_password(password.as_bytes(), &parsed_hash)
            .map_err(|_| AppError::InvalidInput("Invalid password".into()))?;

        //Generate JWT
        let now = chrono::Utc::now();
        let exp = (now + chrono::TimeDelta::days(10)).timestamp() as u64;
        let claims = Claims {
            sub: db_user.id.to_string(),
            exp,
        };
        let key = dotenvy::var("JWT_SECRET")
            .map_err(|_| AppError::InternalError("JWT_SECRET must be set in environment".into()))?;
        let token = encode(
            &Header::new(Algorithm::HS256),
            &claims,
            &EncodingKey::from_secret(key.as_bytes()),
        )
        .map_err(|e| {
            println!("{e}");
            AppError::InternalError("Error encoding JWT".into())
        })?;

        let user: User = db_user.into();
        Ok(LoginResponse { token, user })
    }
}
