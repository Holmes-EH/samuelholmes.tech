use async_graphql::*;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{db::models::DbUser, graphql::error::AppError};

#[derive(Default)]
pub struct UserQuery;

// #[Object]
// impl UserQuery {}
