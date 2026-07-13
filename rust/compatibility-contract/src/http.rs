//! Opt-in HTTP transport. The default build has no network client enabled.

use std::time::Duration;

use crate::{ProviderRequest, ProviderTransport, ProviderTransportResponse};

pub struct HttpProviderTransport {
    agent: ureq::Agent,
    api_key: Option<String>,
}

impl HttpProviderTransport {
    pub fn new(timeout: Duration, api_key: Option<String>) -> Self {
        Self {
            agent: ureq::AgentBuilder::new().timeout(timeout).build(),
            api_key,
        }
    }
}

impl ProviderTransport for HttpProviderTransport {
    fn send(&mut self, request: &ProviderRequest) -> Result<ProviderTransportResponse, String> {
        if request.requires_api_key && self.api_key.is_none() {
            return Err("provider API key is required".to_owned());
        }
        let mut call = self.agent.get(&request.url);
        if let Some(api_key) = &self.api_key {
            call = call.set("X-Api-Key", api_key);
        }
        let response = call
            .call()
            .map_err(|error| redact_error(&error.to_string()))?;
        let status = response.status();
        let body = response
            .into_string()
            .map_err(|error| redact_error(&error.to_string()))?;
        Ok(ProviderTransportResponse {
            status,
            body,
            source_url: request.url.clone(),
        })
    }
}

fn redact_error(error: &str) -> String {
    error
        .split_whitespace()
        .map(|token| {
            if token == "X-Api-Key" {
                "[REDACTED_HEADER]".to_owned()
            } else if token.starts_with("api_key=") {
                "api_key=[REDACTED_SECRET]".to_owned()
            } else {
                token.to_owned()
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

#[cfg(test)]
mod tests {
    use super::redact_error;

    #[test]
    fn redacts_secret_markers_from_transport_errors() {
        let message = redact_error("X-Api-Key api_key=secret");
        assert!(!message.contains("secret"));
        assert!(message.contains("REDACTED"));
    }
}
