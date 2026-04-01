use async_graphql::{InputObject, SimpleObject};

use crate::db::models::DbUser;

// #[derive(InputObject)]
// pub struct CreateUserInput {
//     pub name: String,
//     pub email: String,
//     pub password: String,
// }

#[derive(InputObject)]
pub struct UpdateUserInput {
    pub id: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
}

#[derive(SimpleObject)]
pub struct LoginResponse {
    pub token: String,
    pub user: User,
}

#[derive(SimpleObject)]
pub struct User {
    id: String,
    name: String,
    email: String,
    created_at: String,
    updated_at: String,
}

// Convert DB model to GraphQL output
impl From<DbUser> for User {
    fn from(db: DbUser) -> Self {
        Self {
            id: db.id.to_string(),
            name: db.name,
            email: db.email,
            created_at: db.created_at.to_rfc3339(),
            updated_at: db.updated_at.to_rfc3339(),
        }
    }
}
