use async_graphql::{Context, Guard, Result};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{db::models::DbUser, graphql::error::AppError};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub exp: u64,
}

pub(crate) struct AuthGuard;

impl Guard for AuthGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let user_id_from_ctx = ctx
            .data::<Uuid>()
            .map_err(|_| AppError::Unauthorized("Valid authentication required".into()))?;

        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let _db_user = sqlx::query(
            r#"
            SELECT EXISTS (
                SELECT 1
                FROM users
                WHERE id = $1
            ) AS users_exists
            "#,
        )
        .bind(user_id_from_ctx)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("User not found".into()),
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        Ok(())
    }
}

pub fn validate_jwt_and_extract_user_id(token: &str) -> Result<Uuid, AppError> {
    let key = dotenvy::var("JWT_SECRET")
        .map_err(|_| AppError::InternalError("JWT_SECRET must be set in environment".into()))?;

    let mut validation = Validation::new(Algorithm::HS256);
    validation.set_required_spec_claims(&["exp", "user_id"]);
    let token_data = decode::<Claims>(
        &token,
        &DecodingKey::from_secret(key.as_bytes()),
        &validation,
    )
    .map_err(|_| AppError::Unauthorized("Invalid token".into()))?;

    let user_id = Uuid::parse_str(&token_data.claims.sub)
        .map_err(|_| AppError::Unauthorized("Invalid user ID in token".into()))?;

    Ok(user_id)
}
