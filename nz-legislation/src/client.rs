//! HTTP client for NZ Legislation API.
//!
//! Provides a robust, retry-aware HTTP client with proper error handling.
//! API Documentation: https://api.legislation.govt.nz/docs/

use crate::error::{NzLegislationError, Result};
use crate::config::Config;
use reqwest::{Client, Response};
use std::time::Duration;
use tracing::{debug, error, warn};

/// API client for interacting with NZ Legislation API.
pub struct ApiClient {
    client: Client,
    config: Config,
}

impl ApiClient {
    /// Create a new API client.
    pub fn new(config: Config) -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(config.timeout))
            .build()
            .map_err(NzLegislationError::from)?;

        Ok(Self { client, config })
    }

    /// Get legislation work by ID.
    pub async fn get_work(&self, work_id: &str) -> Result<crate::models::LegislationWork> {
        let url = format!("{}/v0/works/{}", self.config.base_url, work_id);
        debug!("Fetching work: {}", url);

        let response = self
            .execute_with_retry(|| async {
                self.client
                    .get(&url)
                    .query(&[("apikey", &self.config.api_key)])
                    .header("Accept", "application/json")
                    .send()
                    .await
            })
            .await?;

        self.handle_response(response).await
    }

    /// Search for legislation works.
    pub async fn search(
        &self,
        query: Option<&str>,
        legislation_type: Option<&str>,
        status: Option<&str>,
        from_date: Option<&str>,
        to_date: Option<&str>,
        limit: Option<usize>,
        offset: Option<usize>,
    ) -> Result<crate::models::SearchResults> {
        let url = format!("{}/v0/works", self.config.base_url);
        debug!("Searching legislation: {}", url);

        let mut request = self
            .client
            .get(&url)
            .query(&[("apikey", &self.config.api_key)])
            .header("Accept", "application/json");

        if let Some(q) = query {
            request = request.query(&[("q", q)]);
        }
        if let Some(t) = legislation_type {
            request = request.query(&[("type", t)]);
        }
        if let Some(s) = status {
            request = request.query(&[("status", s)]);
        }
        if let Some(from) = from_date {
            request = request.query(&[("from", from)]);
        }
        if let Some(to) = to_date {
            request = request.query(&[("to", to)]);
        }
        if let Some(limit) = limit {
            request = request.query(&[("limit", &limit.to_string())]);
        }
        if let Some(offset) = offset {
            request = request.query(&[("offset", &offset.to_string())]);
        }

        let response = self
            .execute_with_retry(|| async { request.try_clone().unwrap().send().await })
            .await?;

        self.handle_search_response(response).await
    }

    /// Get versions of a work.
    pub async fn get_versions(&self, work_id: &str) -> Result<Vec<crate::models::Version>> {
        let url = format!("{}/v0/works/{}/versions", self.config.base_url, work_id);
        debug!("Fetching versions for work: {}", url);

        let response = self
            .execute_with_retry(|| async {
                self.client
                    .get(&url)
                    .query(&[("apikey", &self.config.api_key)])
                    .header("Accept", "application/json")
                    .send()
                    .await
            })
            .await?;

        self.handle_response(response).await
    }

    /// Get a specific version of legislation.
    pub async fn get_version(&self, version_id: &str) -> Result<crate::models::LegislationVersion> {
        let url = format!("{}/v0/versions/{}", self.config.base_url, version_id);
        debug!("Fetching version: {}", url);

        let response = self
            .execute_with_retry(|| async {
                self.client
                    .get(&url)
                    .query(&[("apikey", &self.config.api_key)])
                    .header("Accept", "application/json")
                    .send()
                    .await
            })
            .await?;

        self.handle_response(response).await
    }

    /// Execute a request with retry logic.
    async fn execute_with_retry<F, Fut>(&self, request_fn: F) -> Result<Response>
    where
        F: Fn() -> Fut,
        Fut: std::future::Future<Output = std::result::Result<Response, reqwest::Error>>,
    {
        let mut last_error = None;

        for attempt in 0..=self.config.max_retries {
            if attempt > 0 {
                let delay = Duration::from_secs((attempt * 2) as u64);
                warn!("Retry attempt {} after {:?}", attempt, delay);
                tokio::time::sleep(delay).await;
            }

            match request_fn().await {
                Ok(response) => {
                    // Check for rate limiting
                    if response.status() == 429 {
                        let retry_after = response
                            .headers()
                            .get("Retry-After")
                            .and_then(|v| v.to_str().ok())
                            .and_then(|s| s.parse().ok())
                            .unwrap_or(300);

                        return Err(NzLegislationError::RateLimitExceeded { retry_after });
                    }

                    return Ok(response);
                }
                Err(e) => {
                    if e.is_timeout() || e.is_connect() {
                        last_error = Some(NzLegislationError::from(e));
                        continue;
                    } else {
                        return Err(NzLegislationError::from(e));
                    }
                }
            }
        }

        Err(last_error.unwrap_or_else(|| {
            NzLegislationError::Other("Max retries exceeded".to_string())
        }))
    }

    /// Handle a standard response.
    async fn handle_response<T: serde::de::DeserializeOwned>(&self, response: Response) -> Result<T> {
        let status = response.status();

        match status {
            reqwest::StatusCode::OK => {
                let body = response.json::<T>().await?;
                Ok(body)
            }
            reqwest::StatusCode::UNAUTHORIZED => {
                Err(NzLegislationError::Authentication(
                    "Invalid API key".to_string(),
                ))
            }
            reqwest::StatusCode::FORBIDDEN => {
                Err(NzLegislationError::Authorization(
                    "Insufficient permissions".to_string(),
                ))
            }
            reqwest::StatusCode::NOT_FOUND => {
                Err(NzLegislationError::NotFound(
                    "Resource not found".to_string(),
                ))
            }
            _ => {
                let error_text = response.text().await.unwrap_or_default();
                error!("API error: {} - {}", status, error_text);
                Err(NzLegislationError::Http {
                    status: status.as_u16(),
                    message: error_text,
                })
            }
        }
    }

    /// Handle a search response.
    async fn handle_search_response(&self, response: Response) -> Result<crate::models::SearchResults> {
        self.handle_response(response).await
    }
}
