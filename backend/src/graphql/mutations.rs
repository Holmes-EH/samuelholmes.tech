use async_graphql::*;
use sqlx::PgPool;

use crate::{
    db::models::DbProject,
    graphql::{
        error::AppError,
        schema::{CreateProjectInput, Project},
    },
};

pub struct Mutation;

#[Object]
impl Mutation {
    async fn create_project(
        &self,
        ctx: &Context<'_>,
        new_project: CreateProjectInput,
    ) -> Result<Project> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let db_project: DbProject = sqlx::query_as::<_, DbProject>(
            r#"
            INSERT INTO projects ( title, description, tech_stack, github_url, live_url, image_url, featured)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            "#
        )
        .bind(&new_project.title)
        .bind(&new_project.description)
        .bind(&new_project.tech_stack)
        .bind(&new_project.github_url)
        .bind(&new_project.live_url)
        .bind(&new_project.image_url)
        .bind(new_project.featured)
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

        Ok(db_project.into())
    }
}
