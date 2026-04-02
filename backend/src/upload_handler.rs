use axum::{
    Extension, Json,
    extract::Multipart,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct UploadResponse {
    pub url: String,
}

pub async fn upload_image_handler(
    Extension(user_id): Extension<Option<Uuid>>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, UploadError> {
    user_id.ok_or(UploadError::Unauthorized)?;

    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads/images".to_string());

    while let Some(field) = multipart.next_field().await? {
        if field.name() == Some("file") {
            let filename = field
                .file_name()
                .ok_or(UploadError::NoFilename)?
                .to_string();

            // Validate extension
            let ext = filename
                .split('.')
                .next_back()
                .ok_or(UploadError::InvalidFile)?;

            if !["jpg", "jpeg", "png", "webp", "gif"].contains(&ext) {
                return Err(UploadError::InvalidImageType);
            }

            // Generate unique filename
            let new_filename = format!("{}.{}", Uuid::now_v7(), ext);
            let filepath = format!("{}/{}", upload_dir, new_filename);

            // Ensure directory exists
            tokio::fs::create_dir_all(&upload_dir)
                .await
                .map_err(|_| UploadError::SaveFailed)?;

            // Save file
            let data = field.bytes().await?;
            tokio::fs::write(&filepath, data)
                .await
                .map_err(|_| UploadError::SaveFailed)?;

            return Ok(Json(UploadResponse {
                url: format!("/images/{}", new_filename),
            }));
        }
    }

    Err(UploadError::NoFile)
}

#[allow(dead_code)]
#[derive(Debug)]
pub enum UploadError {
    NoFile,
    NoFilename,
    InvalidFile,
    InvalidImageType,
    SaveFailed,
    Unauthorized,
    MultipartError(axum::extract::multipart::MultipartError),
}

impl IntoResponse for UploadError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            UploadError::NoFile => (StatusCode::BAD_REQUEST, "No file provided"),
            UploadError::NoFilename => (StatusCode::BAD_REQUEST, "No filename"),
            UploadError::InvalidFile => (StatusCode::BAD_REQUEST, "Invalid file"),
            UploadError::InvalidImageType => (StatusCode::BAD_REQUEST, "Invalid image type"),
            UploadError::SaveFailed => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to save file"),
            UploadError::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                "You must be logged in to upload a file",
            ),
            UploadError::MultipartError(_) => (StatusCode::BAD_REQUEST, "Failed to read multipart"),
        };

        (status, message).into_response()
    }
}

impl From<axum::extract::multipart::MultipartError> for UploadError {
    fn from(err: axum::extract::multipart::MultipartError) -> Self {
        UploadError::MultipartError(err)
    }
}
