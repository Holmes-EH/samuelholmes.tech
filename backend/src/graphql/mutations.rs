use async_graphql::*;
use sqlx::PgPool;

use crate::{
    db::models::DbProject,
    graphql::schema::{CreateProjectInput, Project},
};

pub struct Mutation;

#[Object]
impl Mutation {
    async fn create_project(
        &self,
        ctx: &Context<'_>,
        new_project: CreateProjectInput,
    ) -> Result<Project> {
        let pool = ctx.data::<PgPool>()?;

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
        .await?;

        Ok(db_project.into())
    }
}
