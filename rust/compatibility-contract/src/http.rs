//! Opt-in HTTP transport. The default build has no network client enabled.

use std::io::Read;
use std::time::Duration;

use crate::{ProviderRequest, ProviderTransport, ProviderTransportResponse};

pub struct HttpProviderTransport {
    agent: ureq::Agent,
    api_key: Option<String>,
    max_response_bytes: usize,
}

impl HttpProviderTransport {
    pub fn new(timeout: Duration, api_key: Option<String>) -> Self {
        Self::with_response_limit(timeout, api_key, 1024 * 1024)
    }

    /// Construct a transport with an explicit response-size limit.
    ///
    /// Redirects are disabled so the requested, allowlisted source remains the
    /// only host contacted and provenance cannot be silently redirected.
    pub fn with_response_limit(
        timeout: Duration,
        api_key: Option<String>,
        max_response_bytes: usize,
    ) -> Self {
        Self {
            agent: ureq::AgentBuilder::new()
                .timeout(timeout)
                .redirects(0)
                .build(),
            api_key,
            max_response_bytes,
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
        let mut body = Vec::new();
        response
            .into_reader()
            .take((self.max_response_bytes as u64).saturating_add(1))
            .read_to_end(&mut body)
            .map_err(|error| redact_error(&error.to_string()))?;
        if body.len() > self.max_response_bytes {
            return Err(format!(
                "response exceeds configured limit of {} bytes",
                self.max_response_bytes
            ));
        }
        let body = String::from_utf8(body).map_err(|error| redact_error(&error.to_string()))?;
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
    use super::{redact_error, HttpProviderTransport};
    use crate::{ProviderFeature, ProviderRequest, ProviderTransport};
    use std::io::Write;
    use std::net::TcpListener;
    use std::thread;
    use std::time::Duration;

    fn request(url: String) -> ProviderRequest {
        ProviderRequest {
            jurisdiction: "au-commonwealth".to_owned(),
            feature: ProviderFeature::Search,
            url,
            source_authority: "test authority".to_owned(),
            requires_api_key: false,
        }
    }

    fn server(response: &'static str, delay: Duration) -> String {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind mock server");
        let address = listener.local_addr().expect("mock address");
        thread::spawn(move || {
            let (mut stream, _) = listener.accept().expect("accept request");
            if !delay.is_zero() {
                thread::sleep(delay);
            }
            let mut request_bytes = [0_u8; 1024];
            let _ = std::io::Read::read(&mut stream, &mut request_bytes);
            stream
                .write_all(response.as_bytes())
                .expect("write mock response");
        });
        format!("http://{address}/works/fixture")
    }

    #[test]
    fn redacts_secret_markers_from_transport_errors() {
        let message = redact_error("X-Api-Key api_key=secret");
        assert!(!message.contains("secret"));
        assert!(message.contains("REDACTED"));
    }

    #[test]
    fn rejects_redirects_to_preserve_source_host_policy() {
        let url = server(
            "HTTP/1.1 302 Found\r\nLocation: http://example.invalid/redirected\r\nContent-Length: 0\r\n\r\n",
            Duration::ZERO,
        );
        let mut transport = HttpProviderTransport::new(Duration::from_secs(2), None);
        let error = transport
            .send(&request(url))
            .expect_err("redirect must be rejected");
        assert!(!error.contains("example.invalid"));
    }

    #[test]
    fn enforces_response_size_limit_before_decoding_body() {
        let url = server(
            "HTTP/1.1 200 OK\r\nContent-Length: 8\r\n\r\ntoo-large",
            Duration::ZERO,
        );
        let mut transport =
            HttpProviderTransport::with_response_limit(Duration::from_secs(2), None, 4);
        let error = transport
            .send(&request(url))
            .expect_err("oversized body must fail");
        assert!(error.contains("response exceeds configured limit"));
    }

    #[test]
    fn enforces_transport_timeout_without_network_retry() {
        let url = server(
            "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nok",
            Duration::from_millis(250),
        );
        let mut transport = HttpProviderTransport::new(Duration::from_millis(20), None);
        let error = transport
            .send(&request(url))
            .expect_err("slow server must time out");
        assert!(!error.is_empty());
    }
}
