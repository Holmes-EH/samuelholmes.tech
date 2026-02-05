use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};

pub async fn extract_user_id_from_token(
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "))
        .map(|s| s.to_string());

    req.extensions_mut().insert(token);

    Ok(next.run(req).await)
}
