use async_graphql::*;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    db::models::DbUser,
    graphql::{error::AppError, guard::AuthGuard, users::schema::User},
};

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    #[graphql(guard = "AuthGuard")]
    async fn get_me(&self, ctx: &Context<'_>) -> Result<User> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| "Invalid project ID format")?;

        let user_id_from_ctx = ctx
            .data::<Uuid>()
            .map_err(|_| AppError::Unauthorized("Valid authentication required".into()))?;

        let user: DbUser = sqlx::query_as::<_, DbUser>(
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

        Ok(user.into())
    }
}
