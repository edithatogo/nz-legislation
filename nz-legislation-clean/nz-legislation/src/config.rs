//! Configuration management for NZ Legislation CLI.
//!
//! Handles loading configuration from environment variables and .env files.

use serde::Deserialize;
use std::path::PathBuf;

/// Application configuration.
#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    /// NZ Legislation API key.
    pub api_key: String,

    /// API base URL.
    #[serde(default = "default_base_url")]
    pub base_url: String,

    /// Request timeout in seconds.
    #[serde(default = "default_timeout")]
    pub timeout: u64,

    /// Maximum retries for failed requests.
    #[serde(default = "default_max_retries")]
    pub max_retries: u32,

    /// Rate limit (requests per minute).
    #[serde(default = "default_rate_limit")]
    pub rate_limit: u32,

    /// Cache directory.
    #[serde(default = "default_cache_dir")]
    pub cache_dir: PathBuf,
}

fn default_base_url() -> String {
    "https://api.legislation.govt.nz".to_string()
}

fn default_timeout() -> u64 {
    30
}

fn default_max_retries() -> u32 {
    3
}

fn default_rate_limit() -> u32 {
    60
}

fn default_cache_dir() -> PathBuf {
    // Use system cache directory
    dirs::cache_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("nz-legislation")
}

impl Config {
    /// Load configuration from environment and .env file.
    pub fn load() -> Result<Self, crate::error::NzLegislationError> {
        // Load .env file if it exists
        dotenvy::dotenv().ok();

        // Get API key from environment
        let api_key = std::env::var("NZ_LEGISLATION_API_KEY")
            .map_err(|_| {
                crate::error::NzLegislationError::Config(
                    "NZ_LEGISLATION_API_KEY environment variable not set".to_string(),
                )
            })?;

        // Get base URL from environment or use default
        let base_url = std::env::var("NZ_LEGISLATION_BASE_URL")
            .unwrap_or_else(|_| default_base_url());

        // Get timeout from environment or use default
        let timeout = std::env::var("NZ_LEGISLATION_TIMEOUT")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or_else(default_timeout);

        // Get max retries from environment or use default
        let max_retries = std::env::var("NZ_LEGISLATION_MAX_RETRIES")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or_else(default_max_retries);

        // Get rate limit from environment or use default
        let rate_limit = std::env::var("NZ_LEGISLATION_RATE_LIMIT")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or_else(default_rate_limit);

        // Ensure cache directory exists
        let cache_dir = default_cache_dir();
        if let Err(e) = std::fs::create_dir_all(&cache_dir) {
            tracing::warn!("Failed to create cache directory: {}", e);
        }

        Ok(Self {
            api_key,
            base_url,
            timeout,
            max_retries,
            rate_limit,
            cache_dir,
        })
    }

    /// Load configuration with overrides.
    pub fn load_with_overrides(
        api_key: Option<String>,
        base_url: Option<String>,
    ) -> Result<Self, crate::error::NzLegislationError> {
        let mut config = Self::load()?;

        if let Some(key) = api_key {
            config.api_key = key;
        }

        if let Some(url) = base_url {
            config.base_url = url;
        }

        Ok(config)
    }
}
