use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};

use crate::graphql::guard::validate_jwt_and_extract_user_id;

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

    let user_id = if let Some(token) = token {
        validate_jwt_and_extract_user_id(&token).ok()
    } else {
        None
    };

    req.extensions_mut().insert(user_id);

    Ok(next.run(req).await)
}
