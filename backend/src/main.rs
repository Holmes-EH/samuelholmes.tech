use std::time::Duration;

use anyhow::{Context, Ok};
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::GraphQL;
use axum::{
    Router,
    response::{Html, IntoResponse},
    routing::get,
};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

use crate::graphql::build_schema;

mod db;
mod graphql;

async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().finish())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let database_url =
        dotenvy::var("DATABASE_URL").context("DATABASE_URL must be set in environment")?;

    let db_pool = PgPoolOptions::new()
        .max_connections(20)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&database_url)
        .await
        .context("failed to connect to DATABASE_URL")?;

    sqlx::migrate!().run(&db_pool).await?;

    let schema = build_schema(db_pool);
    let app = Router::new().route("/", get(graphiql).post_service(GraphQL::new(schema)));

    println!("GraphiQL IDE: http://localhost:8000");

    axum::serve(TcpListener::bind("127.0.0.1:8000").await.unwrap(), app).await?;
    Ok(())
}
