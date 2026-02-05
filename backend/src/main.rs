use std::time::Duration;

use anyhow::{Context, Ok};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{Extension, Router, middleware, routing::post};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

use crate::{
    auth_middleware::extract_user_id_from_token,
    graphql::{build_schema, schema::AppSchema},
};

mod auth_middleware;
mod db;
mod graphql;

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

    sqlx::migrate!("src/db/migrations").run(&db_pool).await?;

    let schema = build_schema(db_pool);
    let app = Router::new()
        .route("/graphql", post(graphql_handler))
        .layer(Extension(schema))
        .layer(middleware::from_fn(extract_user_id_from_token));

    println!("Listening @ 127.0.0.1:8000");
    axum::serve(TcpListener::bind("127.0.0.1:8000").await.unwrap(), app).await?;
    Ok(())
}

async fn graphql_handler(
    Extension(schema): Extension<AppSchema>,
    Extension(token): Extension<Option<String>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut request = req.into_inner();
    if let Some(token) = token {
        request = request.data(token);
    }
    schema.execute(request).await.into()
}
