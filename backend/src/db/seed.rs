use std::process;

use argon2::{
    Argon2, PasswordHasher,
    password_hash::{SaltString, rand_core::OsRng},
};
use sqlx::PgPool;

use crate::{graphql::error::AppError, utils::log_error}; // or your AppError, see note below

pub async fn ensure_admin(pool: &PgPool) -> Result<(), Box<dyn std::error::Error>> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await?;

    if count > 0 {
        tracing::info!("seed: users exist, skipping");
        return Ok(());
    }

    let username = match dotenvy::var("SEED_USER") {
        Ok(u_name) => u_name,
        Err(_) => {
            log_error("SEED_USER must be set in environment");
            process::exit(1)
        }
    };
    let user_email = match dotenvy::var("SEED_EMAIL") {
        Ok(u_name) => u_name,
        Err(_) => {
            log_error("SEED_EMAIL must be set in environment");
            process::exit(1)
        }
    };
    let password = match dotenvy::var("SEED_PASS") {
        Ok(pwd) => pwd,
        Err(_) => {
            log_error("SEED_PASS must be set in environment");
            process::exit(1)
        }
    };
    let argon2 = Argon2::default();
    let salt = SaltString::generate(&mut OsRng);
    let pwd_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| AppError::InternalError("Error hashing password".into()))?
        .to_string();

    sqlx::query!(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        username,
        user_email,
        pwd_hash,
    )
    .execute(pool)
    .await?;

    tracing::info!("seed: admin user '{}' created", username);
    Ok(())
}
