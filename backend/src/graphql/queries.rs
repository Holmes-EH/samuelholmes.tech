use async_graphql::*;
use sqlx::PgPool;

use crate::{db::models::DbProject, graphql::schema::Project};

pub struct Query;

#[Object]
impl Query {
    async fn list_projects(&self, ctx: &Context<'_>) -> Result<Vec<Project>> {
        let pool = ctx.data::<PgPool>()?;

        let recs: Vec<DbProject> = sqlx::query_as::<_, DbProject>(
            r#"
            SELECT *
            FROM projects
            ORDER BY created_at
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(recs.into_iter().map(Into::into).collect())
    }
}
