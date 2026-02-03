use async_graphql::*;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    db::models::DbProject,
    graphql::{error::AppError, schema::Project},
};

pub struct Query;

#[Object]
impl Query {
    async fn list_projects(&self, ctx: &Context<'_>) -> Result<Vec<Project>> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let recs: Vec<DbProject> = sqlx::query_as::<_, DbProject>(
            r#"
            SELECT *
            FROM projects
            ORDER BY created_at
            "#,
        )
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

        Ok(recs.into_iter().map(Into::into).collect())
    }

    async fn get_project(&self, ctx: &Context<'_>, project_id: String) -> Result<Project> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| "Invalid project ID format")?;

        let id = Uuid::parse_str(&project_id)
            .map_err(|_| AppError::InvalidInput("Invalid project ID format".into()))?;

        let project: DbProject = sqlx::query_as::<_, DbProject>(
            r#"
            SELECT *
            FROM projects
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("Project not found".into()),
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        Ok(project.into())
    }
}
