use async_graphql::*;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    db::models::DbProject,
    graphql::{
        error::AppError,
        projects::schema::{CreateProjectInput, Project, UpdateProjectInput},
    },
};

#[derive(Default)]
pub struct ProjectMutation;

#[Object]
impl ProjectMutation {
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

    async fn update_project(
        &self,
        ctx: &Context<'_>,
        project: UpdateProjectInput,
    ) -> Result<Project> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| AppError::DatabaseError("Database pool not available".into()))?;

        let id = Uuid::parse_str(&project.id)
            .map_err(|_| AppError::InvalidInput("Invalid project ID format".into()))?;

        let db_project: DbProject = sqlx::query_as::<_, DbProject>(
            r#"
            UPDATE projects
            SET title = $2, description = $3, tech_stack = $4, github_url = $5, live_url = $6, image_url = $7, featured = $8
            WHERE id = $1
            RETURNING *
            "#
        )
        .bind(id)
        .bind(&project.content.title)
        .bind(&project.content.description)
        .bind(&project.content.tech_stack)
        .bind(&project.content.github_url)
        .bind(&project.content.live_url)
        .bind(&project.content.image_url)
        .bind(project.content.featured)
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

    async fn delete_project(&self, ctx: &Context<'_>, project_id: String) -> Result<u64> {
        let pool = ctx
            .data::<PgPool>()
            .map_err(|_| "Invalid project ID format")?;

        let id = Uuid::parse_str(&project_id)
            .map_err(|_| AppError::InvalidInput("Invalid project ID format".into()))?;

        let res = sqlx::query(
            r#"
            DELETE FROM projects
            WHERE id = $1
            "#,
        )
        .bind(id)
        .execute(pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("Project not found".into()),
            _ => AppError::DatabaseError(e.to_string()),
        })?;

        Ok(res.rows_affected())
    }
}
