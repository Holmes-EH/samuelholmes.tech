use async_graphql::{InputObject, SimpleObject};

use crate::db::models::DbProject;

#[derive(InputObject)]
pub struct CreateProjectInput {
    pub title: String,
    pub description: String,
    pub tech_stack: Vec<String>,
    pub github_url: Option<String>,
    pub live_url: Option<String>,
    pub image_url: Option<String>,
    #[graphql(default = false)]
    pub featured: bool,
}

#[derive(InputObject)]
pub struct UpdateProjectInput {
    pub id: String,
    pub content: CreateProjectInput,
}

#[derive(SimpleObject)]
pub struct Project {
    id: String,
    title: String,
    description: String,
    tech_stack: Vec<String>,
    github_url: Option<String>,
    live_url: Option<String>,
    image_url: Option<String>,
    featured: bool,
    created_at: String,
    updated_at: String,
}

// Convert DB model to GraphQL output
impl From<DbProject> for Project {
    fn from(db: DbProject) -> Self {
        Self {
            id: db.id.to_string(),
            title: db.title,
            description: db.description,
            tech_stack: db.tech_stack,
            github_url: db.github_url,
            live_url: db.live_url,
            image_url: db.image_url,
            featured: db.featured,
            created_at: db.created_at.to_rfc3339(),
            updated_at: db.updated_at.to_rfc3339(),
        }
    }
}
