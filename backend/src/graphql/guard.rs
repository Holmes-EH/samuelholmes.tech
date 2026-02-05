use async_graphql::{Context, Guard, Result};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};

use crate::graphql::error::AppError;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub user_id: String,
    pub exp: u64,
}

pub(crate) struct AuthGuard;

impl Guard for AuthGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let token = ctx
            .data_opt::<String>()
            .ok_or("Unauthorized: No token provided")?;

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

        let user_id = token_data.claims.user_id;

        println!("{user_id}");

        Ok(())
    }
}
