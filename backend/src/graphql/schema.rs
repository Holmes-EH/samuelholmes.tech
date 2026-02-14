use async_graphql::{EmptySubscription, MergedObject, Schema};
use sqlx::{Pool, Postgres};

use crate::graphql::{
    projects::{mutations::ProjectMutation, queries::ProjectQuery},
    users::{mutations::UserMutation, queries::UserQuery},
};

#[derive(MergedObject, Default)]
pub struct QueryRoot(ProjectQuery, UserQuery);

#[derive(MergedObject, Default)]
pub struct MutationRoot(ProjectMutation, UserMutation);

pub type AppSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub fn build_schema(pool: Pool<Postgres>) -> AppSchema {
    Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(pool)
    .finish()
}
