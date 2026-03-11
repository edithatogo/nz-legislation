//! Error types for NZ Legislation CLI.
//!
//! Uses `thiserror` for structured error handling with clear error messages.

use thiserror::Error;

/// Main error type for the application.
#[derive(Error, Debug)]
pub enum NzLegislationError {
    /// API authentication failed.
    #[error("Authentication failed: {0}")]
    Authentication(String),

    /// API authorization failed.
    #[error("Authorization failed: {0}")]
    Authorization(String),

    /// Resource not found.
    #[error("Resource not found: {0}")]
    NotFound(String),

    /// Rate limit exceeded.
    #[error("Rate limit exceeded. Retry after {retry_after} seconds")]
    RateLimitExceeded {
        /// Seconds until retry is allowed.
        retry_after: u64,
    },

    /// HTTP request failed.
    #[error("HTTP error: {status} - {message}")]
    Http {
        /// HTTP status code.
        status: u16,
        /// Error message.
        message: String,
    },

    /// Network connection failed.
    #[error("Connection failed: {0}")]
    Connection(String),

    /// Request timed out.
    #[error("Request timed out after {timeout_secs} seconds")]
    Timeout {
        /// Timeout duration in seconds.
        timeout_secs: u64,
    },

    /// JSON parsing failed.
    #[error("Failed to parse JSON: {0}")]
    JsonParse(#[from] serde_json::Error),

    /// HTTP client error.
    #[error("HTTP client error: {0}")]
    HttpClient(#[from] reqwest::Error),

    /// Configuration error.
    #[error("Configuration error: {0}")]
    Config(String),

    /// IO error.
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// URL parsing error.
    #[error("Invalid URL: {0}")]
    UrlParse(#[from] url::ParseError),

    /// Generic error for internal use.
    #[error("{0}")]
    Other(String),
}

impl NzLegislationError {
    /// Returns true if this error is retryable.
    pub fn is_retryable(&self) -> bool {
        matches!(
            self,
            Self::Connection(_) | Self::Timeout { .. } | Self::RateLimitExceeded { .. }
        )
    }

    /// Returns the HTTP status code if applicable.
    pub fn status_code(&self) -> Option<u16> {
        match self {
            Self::Http { status, .. } => Some(*status),
            Self::Authentication(_) => Some(401),
            Self::Authorization(_) => Some(403),
            Self::NotFound(_) => Some(404),
            Self::RateLimitExceeded { .. } => Some(429),
            _ => None,
        }
    }
}

/// Result type alias for convenience.
pub type Result<T> = std::result::Result<T, NzLegislationError>;
