use std::process;

use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    Extension, Router,
    http::{Method, header},
    middleware,
    routing::post,
};
use sqlx::{Connection, PgConnection, postgres::PgPoolOptions};
use tokio::net::TcpListener;
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
};
use uuid::Uuid;

use crate::{
    auth_middleware::extract_user_id_from_token,
    db::seed,
    graphql::{build_schema, schema::AppSchema},
    upload_handler::upload_image_handler,
    utils::{log_error, log_info},
};

mod auth_middleware;
mod db;
mod graphql;
mod upload_handler;
mod utils;

#[tokio::main]
async fn main() {
    validate_env();
    let database_url = match dotenvy::var("DATABASE_URL") {
        Ok(db_url) => db_url,
        Err(_) => {
            log_error("DATABASE_URL must be set in environment");
            process::exit(1)
        }
    };

    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads/images".to_string());

    test_db_connection(&database_url).await;

    let db_pool = match PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await
    {
        Ok(pool) => pool,
        Err(_) => {
            log_error("failed to connect to DATABASE_URL");
            process::exit(1);
        }
    };

    if let Err(err) = sqlx::migrate!("src/db/migrations").run(&db_pool).await {
        log_error(format!("error running migrations : {err}"));
        process::exit(1);
    };
    if let Err(err) = seed::ensure_admin(&db_pool).await {
        log_error(format!("error seeding : {err}"));
        process::exit(1);
    };

    let cors = {
        let base = CorsLayer::new()
            .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
            .allow_headers([header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE]);

        match std::env::var("CORS_ALLOWED_ORIGINS") {
            Ok(origins) if !origins.trim().is_empty() => {
                let parsed: Vec<axum::http::HeaderValue> = origins
                    .split(',')
                    .filter_map(|s| s.trim().parse().ok())
                    .collect();
                base.allow_origin(parsed).allow_credentials(true)
            }
            _ => base.allow_origin(Any),
        }
    };

    let schema = build_schema(db_pool);
    let app = Router::new()
        .route("/graphql", post(graphql_handler))
        .route("/upload", post(upload_image_handler))
        .nest_service("/images", ServeDir::new(&upload_dir))
        .layer(cors)
        .layer(Extension(schema))
        .layer(middleware::from_fn(extract_user_id_from_token));

    let address = std::env::var("BIND_ADDR").unwrap_or_else(|_| "0.0.0.0:8000".to_string());

    let listener = match TcpListener::bind(address.clone()).await {
        Ok(tcp_listener) => tcp_listener,
        Err(err) => {
            log_error(format!("error listening on 127.0.0.1:8000: {err}"));
            process::exit(1);
        }
    };
    log_info(format!("listening @ {address}"));
    if let Err(err) = axum::serve(listener, app).await {
        log_error(format!("error serving app : {err}"));
        process::exit(1);
    };
}

fn validate_env() {
    if dotenvy::var("DATABASE_URL").is_err() {
        log_error("DATABASE_URL must be set in environment");
        process::exit(1)
    }
    if dotenvy::var("JWT_SECRET").is_err() {
        log_error("JWT_SECRET must be set in environment");
        process::exit(1)
    }
    if dotenvy::var("SEED_USER").is_err() {
        log_error("SEED_USER must be set in environment");
        process::exit(1)
    }
    if dotenvy::var("SEED_EMAIL").is_err() {
        log_error("SEED_EMAIL must be set in environment");
        process::exit(1)
    }
    if dotenvy::var("SEED_PASS").is_err() {
        log_error("SEED_PASS must be set in environment");
        process::exit(1)
    }
}

async fn test_db_connection(url: &str) {
    match PgConnection::connect(url).await {
        Ok(conn) => {
            conn.close().await.ok();
            log_info("Successfully connected to DB");
        }
        Err(e) => {
            log_error(format!("Failed to connect to DATABASE_URL: {e}"));
            process::exit(1);
        }
    }
}

async fn graphql_handler(
    Extension(schema): Extension<AppSchema>,
    Extension(user_id): Extension<Option<Uuid>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut request = req.into_inner();
    if let Some(id) = user_id {
        request = request.data(id);
    }
    schema.execute(request).await.into()
}
