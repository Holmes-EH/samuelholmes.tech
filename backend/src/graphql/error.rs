use async_graphql::ErrorExtensions;

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    InvalidInput(String),
    DatabaseError(String),
    Unauthorized(String),
    InternalError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "{}", msg),
            AppError::InvalidInput(msg) => write!(f, "{}", msg),
            AppError::DatabaseError(msg) => write!(f, "{}", msg),
            AppError::Unauthorized(msg) => write!(f, "{}", msg),
            AppError::InternalError(msg) => write!(f, "{}", msg),
        }
    }
}

impl std::error::Error for AppError {}

impl ErrorExtensions for AppError {
    fn extend(&self) -> async_graphql::Error {
        let mut err = async_graphql::Error::new(self.to_string());

        match self {
            AppError::NotFound(_) => err = err.extend_with(|_, e| e.set("code", "NOT_FOUND")),
            AppError::InvalidInput(_) => {
                err = err.extend_with(|_, e| e.set("code", "INVALID_INPUT"))
            }
            AppError::DatabaseError(_) => {
                err = err.extend_with(|_, e| e.set("code", "DATABASE_ERROR"))
            }
            AppError::Unauthorized(_) => {
                err = err.extend_with(|_, e| e.set("code", "AUTHORIZATION_ERROR"))
            }
            AppError::InternalError(_) => {
                err = err.extend_with(|_, e| e.set("code", "SERVER_ERROR"))
            }
        }

        err
    }
}
