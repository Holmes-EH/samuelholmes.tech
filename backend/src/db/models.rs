use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(FromRow)]
pub struct DbProject {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub tech_stack: Vec<String>,
    pub github_url: Option<String>,
    pub live_url: Option<String>,
    pub image_url: Option<String>,
    pub featured: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(FromRow)]
pub struct DbUser {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub password: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
