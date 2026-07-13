//! Language-neutral compatibility constants for the staged Rust migration.
//!
//! This crate contains only language-neutral validation, not a CLI, MCP server,
//! provider, or legal-data runtime. It is the first executable component of the
//! staged migration and remains non-publishing until parity gates pass.

#[cfg(feature = "network")]
pub mod http;

pub const CLI_BINARIES: &[&str] = &["nzlegislation", "anzlegislation", "legislation"];
pub const MCP_BINARIES: &[&str] = &["nzlegislation-mcp", "anzlegislation-mcp", "legislation-mcp"];
pub const COMMANDS: &[&str] = &[
    "search",
    "get",
    "export",
    "cite",
    "batch",
    "cache",
    "capabilities",
    "config",
    "generate",
    "stream",
];
pub const PROVIDER_IDENTIFIERS: &[&str] = &["nz", "au-commonwealth", "au-qld"];
pub const MCP_TOOLS: &[&str] = &[
    "search_legislation",
    "get_legislation",
    "get_legislation_versions",
    "generate_citation",
    "export_legislation",
    "get_capabilities",
    "get_config",
];

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BinaryKind {
    Cli,
    Mcp,
}

pub fn classify_binary(name: &str) -> Option<BinaryKind> {
    if CLI_BINARIES.contains(&name) {
        Some(BinaryKind::Cli)
    } else if MCP_BINARIES.contains(&name) {
        Some(BinaryKind::Mcp)
    } else {
        None
    }
}

pub fn is_supported_command(command: &str) -> bool {
    COMMANDS.contains(&command)
}

pub fn is_supported_provider(provider: &str) -> bool {
    PROVIDER_IDENTIFIERS.contains(&provider)
}

pub fn is_supported_mcp_tool(tool: &str) -> bool {
    MCP_TOOLS.contains(&tool)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CapabilityStatus {
    Supported,
    Prerelease,
    Unsupported,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReleaseChannel {
    Stable,
    Prerelease,
    Planned,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProviderCapability {
    pub jurisdiction: String,
    pub label: String,
    pub provider_id: String,
    pub source_authority: String,
    pub release_channel: ReleaseChannel,
    pub features: Vec<(ProviderFeature, FeatureCapability)>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProviderFeature {
    Search,
    GetWork,
    GetVersions,
    GetVersion,
    Citation,
    Export,
    Mcp,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct FeatureCapability {
    pub status: CapabilityStatus,
    pub source_backed: bool,
    pub notes: String,
}

fn feature_set(capability: FeatureCapability) -> Vec<(ProviderFeature, FeatureCapability)> {
    [
        ProviderFeature::Search,
        ProviderFeature::GetWork,
        ProviderFeature::GetVersions,
        ProviderFeature::GetVersion,
        ProviderFeature::Citation,
        ProviderFeature::Export,
        ProviderFeature::Mcp,
    ]
    .into_iter()
    .map(|feature| (feature, capability.clone()))
    .collect()
}

fn capability(status: CapabilityStatus, source_backed: bool, notes: &str) -> FeatureCapability {
    FeatureCapability {
        status,
        source_backed,
        notes: notes.to_owned(),
    }
}

/// Source-backed provider capability inventory shared by Rust contract consumers.
/// This is metadata only; it performs no network access or legal-data fetches.
pub fn provider_capability_manifest() -> Vec<ProviderCapability> {
    let nz = capability(
        CapabilityStatus::Supported,
        true,
        "Backed by the existing legislation.govt.nz API client surface.",
    );
    let commonwealth = capability(
        CapabilityStatus::Prerelease,
        true,
        "Prerelease support backed by the Federal Register of Legislation public API.",
    );
    let unsupported_commonwealth = capability(
        CapabilityStatus::Unsupported,
        false,
        "Federal Register mapping for this feature is not complete; use structured unsupported capability errors.",
    );
    let unsupported_australian = capability(
        CapabilityStatus::Unsupported,
        false,
        "Source validation and provider implementation are required before this feature can be enabled.",
    );
    let mut commonwealth_features = feature_set(commonwealth);
    for (feature, value) in &mut commonwealth_features {
        if matches!(
            feature,
            ProviderFeature::GetVersion | ProviderFeature::Citation
        ) {
            *value = unsupported_commonwealth.clone();
        }
    }
    vec![
        ProviderCapability {
            jurisdiction: "nz".to_owned(),
            label: "New Zealand".to_owned(),
            provider_id: "legislation-govt-nz".to_owned(),
            source_authority: "legislation.govt.nz".to_owned(),
            release_channel: ReleaseChannel::Stable,
            features: feature_set(nz),
        },
        ProviderCapability {
            jurisdiction: "au-commonwealth".to_owned(),
            label: "Australian Commonwealth".to_owned(),
            provider_id: "federal-register-of-legislation".to_owned(),
            source_authority: "Federal Register of Legislation public API".to_owned(),
            release_channel: ReleaseChannel::Prerelease,
            features: commonwealth_features,
        },
        ProviderCapability {
            jurisdiction: "au-qld".to_owned(),
            label: "Queensland".to_owned(),
            provider_id: "queensland-legislation".to_owned(),
            source_authority: "Queensland Legislation API service".to_owned(),
            release_channel: ReleaseChannel::Planned,
            features: feature_set(unsupported_australian),
        },
    ]
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProviderRequest {
    pub jurisdiction: String,
    pub feature: ProviderFeature,
    pub url: String,
    pub source_authority: String,
    pub requires_api_key: bool,
}

/// Request shape used by the staged Commonwealth adapter.  This mirrors the
/// TypeScript provider's OData `titles` and `versions` calls without fetching
/// or inventing legal records.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommonwealthRequest {
    pub feature: ProviderFeature,
    pub path: String,
    pub search_params: BTreeMap<String, String>,
}

/// Build the source-backed Commonwealth OData request shape used by the
/// existing TypeScript adapter.
pub fn build_commonwealth_request(
    feature: ProviderFeature,
    identifier: Option<&str>,
) -> Result<CommonwealthRequest, ProviderRequestError> {
    let mut search_params = BTreeMap::new();
    let path = match feature {
        ProviderFeature::Search => {
            search_params.insert("$count".to_owned(), "true".to_owned());
            search_params.insert("$skip".to_owned(), "0".to_owned());
            search_params.insert("$top".to_owned(), "20".to_owned());
            "titles".to_owned()
        }
        ProviderFeature::GetWork => {
            let id = identifier
                .filter(|value| !value.is_empty())
                .ok_or(ProviderRequestError::InvalidIdentifier)?;
            validate_commonwealth_identifier(id)?;
            search_params.insert(
                "$filter".to_owned(),
                format!("id eq '{}'", escape_commonwealth_odata(id)),
            );
            search_params.insert("$top".to_owned(), "1".to_owned());
            "titles".to_owned()
        }
        ProviderFeature::GetVersions => {
            let id = identifier
                .filter(|value| !value.is_empty())
                .ok_or(ProviderRequestError::InvalidIdentifier)?;
            validate_commonwealth_identifier(id)?;
            search_params.insert(
                "$filter".to_owned(),
                format!("titleId eq '{}'", escape_commonwealth_odata(id)),
            );
            "versions".to_owned()
        }
        _ => {
            return Err(ProviderRequestError::UnsupportedCapability(
                UnsupportedProviderCapability {
                    error: "unsupported_provider_capability".to_owned(),
                    jurisdiction: "au-commonwealth".to_owned(),
                    provider_id: "federal-register-of-legislation".to_owned(),
                    feature,
                    status: CapabilityStatus::Unsupported,
                    source_backed: false,
                    message: "Commonwealth request mapping is not enabled for this feature."
                        .to_owned(),
                },
            ))
        }
    };
    Ok(CommonwealthRequest {
        feature,
        path,
        search_params,
    })
}

fn validate_commonwealth_identifier(value: &str) -> Result<(), ProviderRequestError> {
    if value.contains('/') || value.contains('\\') || value.contains("..") {
        return Err(ProviderRequestError::InvalidIdentifier);
    }
    Ok(())
}

fn escape_commonwealth_odata(value: &str) -> String {
    value.replace('\'', "''")
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProviderTransportResponse {
    pub status: u16,
    pub body: String,
    pub source_url: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProviderExecutionResult {
    pub jurisdiction: String,
    pub feature: ProviderFeature,
    pub status: u16,
    pub body: String,
    pub provenance: ProvenanceMetadata,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProviderExecutionError {
    Transport(String),
    NonSuccessStatus(u16),
    ProvenanceMismatch,
}

pub trait ProviderTransport {
    fn send(&mut self, request: &ProviderRequest) -> Result<ProviderTransportResponse, String>;
}

/// Execute an already-validated request through an injected transport.
/// No concrete network client is enabled by this crate.
pub fn execute_provider_request<T: ProviderTransport>(
    transport: &mut T,
    request: &ProviderRequest,
) -> Result<ProviderExecutionResult, ProviderExecutionError> {
    let response = transport
        .send(request)
        .map_err(ProviderExecutionError::Transport)?;
    if !(200..=299).contains(&response.status) {
        return Err(ProviderExecutionError::NonSuccessStatus(response.status));
    }
    if response.source_url != request.url {
        return Err(ProviderExecutionError::ProvenanceMismatch);
    }
    Ok(ProviderExecutionResult {
        jurisdiction: request.jurisdiction.clone(),
        feature: request.feature,
        status: response.status,
        body: response.body,
        provenance: ProvenanceMetadata {
            source_authority: request.source_authority.clone(),
            source_url: Some(response.source_url),
            retrieved_at: None,
            source_backed: true,
        },
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProviderRequestError {
    UnsupportedCapability(UnsupportedProviderCapability),
    InvalidIdentifier,
}

/// Build an allowlisted request description without performing network I/O.
pub fn build_provider_request(
    jurisdiction: &str,
    feature: ProviderFeature,
    identifier: &str,
) -> Result<ProviderRequest, ProviderRequestError> {
    if identifier.is_empty()
        || identifier.contains('/')
        || identifier.contains('\\')
        || identifier.contains("..")
    {
        return Err(ProviderRequestError::InvalidIdentifier);
    }
    let (provider_id, source_authority, base_url, requires_api_key, status, notes) =
        match jurisdiction {
            "nz" => (
                "legislation-govt-nz",
                "legislation.govt.nz",
                "https://api.legislation.govt.nz/v0/works",
                true,
                CapabilityStatus::Supported,
                "Backed by the existing legislation.govt.nz API client surface.",
            ),
            "au-commonwealth" => (
                "federal-register-of-legislation",
                "Federal Register of Legislation public API",
                "https://api.prod.legislation.gov.au/v1/works",
                false,
                CapabilityStatus::Prerelease,
                "Prerelease support backed by the Federal Register of Legislation public API.",
            ),
            _ => {
                return Err(ProviderRequestError::UnsupportedCapability(
                    UnsupportedProviderCapability {
                        error: "unsupported_provider_capability".to_owned(),
                        jurisdiction: jurisdiction.to_owned(),
                        provider_id: "unknown".to_owned(),
                        feature,
                        status: CapabilityStatus::Unsupported,
                        source_backed: false,
                        message: "Provider request planning is not enabled for this jurisdiction."
                            .to_owned(),
                    },
                ))
            }
        };
    let capability = FeatureCapability {
        status,
        source_backed: true,
        notes: notes.to_owned(),
    };
    require_capability(jurisdiction, provider_id, feature, &capability)
        .map_err(ProviderRequestError::UnsupportedCapability)?;
    Ok(ProviderRequest {
        jurisdiction: jurisdiction.to_owned(),
        feature,
        url: format!("{base_url}/{identifier}"),
        source_authority: source_authority.to_owned(),
        requires_api_key,
    })
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UnsupportedProviderCapability {
    pub error: String,
    pub jurisdiction: String,
    pub provider_id: String,
    pub feature: ProviderFeature,
    pub status: CapabilityStatus,
    pub source_backed: bool,
    pub message: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct McpRequest {
    pub tool: String,
    pub jurisdiction: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GateStatus {
    Allowed,
    Blocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProvenanceMetadata {
    pub source_authority: String,
    pub source_url: Option<String>,
    pub retrieved_at: Option<String>,
    pub source_backed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct McpResponse {
    pub tool: String,
    pub jurisdiction: String,
    pub release_gate: GateStatus,
    pub submission_gate: GateStatus,
    pub provenance: Option<ProvenanceMetadata>,
    pub error: Option<UnsupportedProviderCapability>,
}

pub fn validate_mcp_request(request: &McpRequest) -> Result<(), CliContractError> {
    if !is_supported_mcp_tool(&request.tool) {
        return Err(CliContractError::UnsupportedOption(request.tool.clone()));
    }
    if !is_supported_provider(&request.jurisdiction) {
        return Err(CliContractError::UnsupportedCommand(
            request.jurisdiction.clone(),
        ));
    }
    Ok(())
}

pub fn require_capability(
    jurisdiction: &str,
    provider_id: &str,
    feature: ProviderFeature,
    capability: &FeatureCapability,
) -> Result<(), UnsupportedProviderCapability> {
    if capability.status == CapabilityStatus::Unsupported || !capability.source_backed {
        return Err(UnsupportedProviderCapability {
            error: "unsupported_provider_capability".to_owned(),
            jurisdiction: jurisdiction.to_owned(),
            provider_id: provider_id.to_owned(),
            feature,
            status: capability.status,
            source_backed: capability.source_backed,
            message: capability.notes.clone(),
        });
    }
    Ok(())
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OutputFormat {
    Table,
    Json,
    Csv,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommandRequest {
    pub command: String,
    pub format: OutputFormat,
    pub jurisdiction: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CliContractError {
    MissingCommand,
    UnsupportedCommand(String),
    MissingOptionValue(String),
    UnsupportedFormat(String),
    UnsupportedOption(String),
}

pub fn parse_command_args<I, S>(args: I) -> Result<CommandRequest, CliContractError>
where
    I: IntoIterator<Item = S>,
    S: Into<String>,
{
    let mut command = None;
    let mut format = OutputFormat::Table;
    let mut jurisdiction = None;
    let mut iter = args.into_iter().map(Into::into);

    while let Some(arg) = iter.next() {
        if arg == "--format" {
            let value = iter
                .next()
                .ok_or_else(|| CliContractError::MissingOptionValue(arg.clone()))?;
            format = match value.as_str() {
                "table" => OutputFormat::Table,
                "json" => OutputFormat::Json,
                "csv" => OutputFormat::Csv,
                _ => return Err(CliContractError::UnsupportedFormat(value)),
            };
        } else if arg == "--jurisdiction" {
            jurisdiction = Some(
                iter.next()
                    .ok_or_else(|| CliContractError::MissingOptionValue(arg.clone()))?,
            );
        } else if arg.starts_with('-') {
            return Err(CliContractError::UnsupportedOption(arg));
        } else if command.is_none() {
            if !is_supported_command(&arg) {
                return Err(CliContractError::UnsupportedCommand(arg));
            }
            command = Some(arg);
        }
    }

    command
        .map(|command| CommandRequest {
            command,
            format,
            jurisdiction,
        })
        .ok_or(CliContractError::MissingCommand)
}

#[cfg(test)]
mod tests {
    use serde::Deserialize;

    use super::*;

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct Fixture {
        cli_binaries: Vec<String>,
        mcp_binaries: Vec<String>,
        commands: Vec<String>,
        provider_identifiers: Vec<String>,
    }

    #[derive(Deserialize)]
    struct McpFixture {
        tools: Vec<String>,
        response_fields: Vec<String>,
        provenance_fields: Vec<String>,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct RuntimeFixture {
        typescript_runtime: RuntimeEntry,
        rust_runtime: RuntimeEntry,
        cutover_allowed: bool,
        reason: String,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct RuntimeEntry {
        available: bool,
        security_checks: Vec<String>,
        performance_evidence: Option<String>,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct CommonwealthFixture {
        provider_id: String,
        api_base_url: String,
        register_base_url: String,
        requests: Vec<CommonwealthRequest>,
    }

    const FIXTURE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/cli-contracts.json"
    ));

    const MCP_FIXTURE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/mcp-contracts.json"
    ));

    const RUNTIME_FIXTURE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/runtime-comparison.json"
    ));

    const RUNTIME_EVIDENCE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/runtime-comparison-evidence.json"
    ));

    #[derive(Debug, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct RuntimeEvidence {
        schema_version: u8,
        mode: String,
        live_legal_data: bool,
        typescript: RuntimeEvidenceSide,
        rust: RustEvidenceSide,
        cutover: CutoverEvidence,
    }
    #[derive(Debug, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct RuntimeEvidenceSide {
        status: String,
        timing_source: Option<String>,
        security_evidence: Vec<String>,
    }
    #[derive(Debug, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct RustEvidenceSide {
        status: String,
        timing_source: Option<String>,
        security_evidence: Vec<String>,
        blocked_reason: Option<String>,
    }
    #[derive(Debug, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct CutoverEvidence {
        allowed: bool,
        required_evidence: Vec<String>,
    }

    const COMMONWEALTH_FIXTURE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/commonwealth-contracts.json"
    ));

    #[test]
    fn blocks_cutover_without_dual_runtime_evidence() {
        let fixture: RuntimeFixture =
            serde_json::from_str(RUNTIME_FIXTURE).expect("valid runtime comparison fixture");
        assert!(fixture.typescript_runtime.available);
        assert_eq!(
            fixture.typescript_runtime.performance_evidence.as_deref(),
            Some("benchmarks/performance.ts")
        );
        assert!(!fixture.rust_runtime.available);
        assert!(fixture.rust_runtime.performance_evidence.is_none());
        assert!(!fixture.cutover_allowed);
        assert!(fixture.reason.contains("not yet available"));
        assert!(!fixture.typescript_runtime.security_checks.is_empty());
        assert_eq!(
            fixture.rust_runtime.security_checks,
            vec![
                "cargo-check-locked".to_owned(),
                "cargo-test-locked".to_owned(),
                "cargo-tree-locked".to_owned()
            ]
        );
    }

    #[test]
    fn enforces_deterministic_dual_runtime_evidence_gate() {
        let evidence: RuntimeEvidence =
            serde_json::from_str(RUNTIME_EVIDENCE).expect("valid evidence fixture");
        assert_eq!(evidence.schema_version, 1);
        assert_eq!(evidence.mode, "contract-only");
        assert!(!evidence.live_legal_data);
        assert_eq!(evidence.typescript.status, "measured");
        assert_eq!(
            evidence.typescript.timing_source.as_deref(),
            Some("benchmarks/performance.ts")
        );
        assert!(!evidence.typescript.security_evidence.is_empty());
        assert_eq!(evidence.rust.status, "blocked");
        assert!(evidence.rust.timing_source.is_none());
        assert!(evidence
            .rust
            .blocked_reason
            .as_deref()
            .is_some_and(|reason| reason.contains("provider-backed Rust runtime")));
        assert!(!evidence.rust.security_evidence.is_empty());
        assert!(!evidence.cutover.allowed);
        assert_eq!(
            evidence.cutover.required_evidence,
            vec![
                "provider-backed-runtime",
                "same-fixtures",
                "performance-comparison",
                "security-comparison"
            ]
        );
    }

    #[test]
    fn preserves_mcp_tool_and_provenance_contract() {
        let fixture: McpFixture = serde_json::from_str(MCP_FIXTURE).expect("valid MCP fixture");
        assert_eq!(fixture.tools, MCP_TOOLS);
        assert_eq!(
            fixture.response_fields,
            [
                "tool",
                "jurisdiction",
                "release_gate",
                "submission_gate",
                "provenance"
            ]
        );
        assert_eq!(
            fixture.provenance_fields,
            [
                "sourceAuthority",
                "sourceUrl",
                "retrievedAt",
                "sourceBacked"
            ]
        );
    }

    #[test]
    fn preserves_compatibility_aliases() {
        assert_eq!(
            CLI_BINARIES,
            &["nzlegislation", "anzlegislation", "legislation"]
        );
        assert_eq!(MCP_BINARIES.len(), 3);
    }

    #[test]
    fn preserves_non_empty_command_and_provider_contracts() {
        assert!(!COMMANDS.is_empty());
        assert_eq!(PROVIDER_IDENTIFIERS, &["nz", "au-commonwealth", "au-qld"]);
    }

    #[test]
    fn mirrors_source_backed_provider_manifest_without_network_access() {
        let manifest = provider_capability_manifest();
        assert_eq!(manifest.len(), 3);
        assert_eq!(manifest[0].jurisdiction, "nz");
        assert_eq!(manifest[0].release_channel, ReleaseChannel::Stable);
        assert!(manifest[0]
            .features
            .iter()
            .all(
                |(_, capability)| capability.status == CapabilityStatus::Supported
                    && capability.source_backed
            ));

        let commonwealth = &manifest[1];
        assert_eq!(commonwealth.release_channel, ReleaseChannel::Prerelease);
        assert!(commonwealth.features.iter().any(|(feature, capability)| {
            *feature == ProviderFeature::GetVersion
                && capability.status == CapabilityStatus::Unsupported
                && !capability.source_backed
        }));

        let queensland = &manifest[2];
        assert_eq!(queensland.release_channel, ReleaseChannel::Planned);
        assert!(queensland
            .features
            .iter()
            .all(
                |(_, capability)| capability.status == CapabilityStatus::Unsupported
                    && !capability.source_backed
            ));
    }

    #[test]
    fn plans_allowlisted_provider_requests_without_network_access() {
        let nz = build_provider_request("nz", ProviderFeature::Search, "act/2020/67");
        assert_eq!(nz, Err(ProviderRequestError::InvalidIdentifier));

        let nz = build_provider_request("nz", ProviderFeature::Search, "act_2020_67")
            .expect("NZ request plan");
        assert_eq!(
            nz.url,
            "https://api.legislation.govt.nz/v0/works/act_2020_67"
        );
        assert!(nz.requires_api_key);

        let au = build_provider_request("au-commonwealth", ProviderFeature::Search, "C2024A00001")
            .expect("Commonwealth request plan");
        assert_eq!(
            au.source_authority,
            "Federal Register of Legislation public API"
        );
        assert!(!au.requires_api_key);

        let qld = build_provider_request("au-qld", ProviderFeature::Search, "1");
        assert!(matches!(
            qld,
            Err(ProviderRequestError::UnsupportedCapability(_))
        ));
    }

    #[test]
    fn mirrors_commonwealth_odata_request_shapes_without_network_access() {
        let fixture: CommonwealthFixture =
            serde_json::from_str(COMMONWEALTH_FIXTURE).expect("valid Commonwealth fixture");
        assert_eq!(fixture.provider_id, "federal-register-of-legislation");
        assert_eq!(
            fixture.api_base_url,
            "https://api.prod.legislation.gov.au/v1"
        );
        assert_eq!(fixture.register_base_url, "https://www.legislation.gov.au");

        let expected = [
            build_commonwealth_request(ProviderFeature::Search, None).expect("search plan"),
            build_commonwealth_request(ProviderFeature::GetWork, Some("C2004A01224"))
                .expect("title plan"),
            build_commonwealth_request(ProviderFeature::GetVersions, Some("C2004A01224"))
                .expect("versions plan"),
        ];
        assert_eq!(fixture.requests, expected);
    }

    struct MockTransport {
        response: Result<ProviderTransportResponse, String>,
    }

    impl ProviderTransport for MockTransport {
        fn send(
            &mut self,
            _request: &ProviderRequest,
        ) -> Result<ProviderTransportResponse, String> {
            self.response.clone()
        }
    }

    #[test]
    fn executes_injected_transport_with_provenance_and_status_gates() {
        let request = build_provider_request("nz", ProviderFeature::Search, "act_2020_67")
            .expect("request plan");
        let mut transport = MockTransport {
            response: Ok(ProviderTransportResponse {
                status: 200,
                body: "{\"results\":[]}".to_owned(),
                source_url: request.url.clone(),
            }),
        };
        let result = execute_provider_request(&mut transport, &request).expect("execution result");
        assert_eq!(result.status, 200);
        assert!(result.provenance.source_backed);
        assert_eq!(
            result.provenance.source_url.as_deref(),
            Some(request.url.as_str())
        );

        transport.response = Ok(ProviderTransportResponse {
            status: 503,
            body: "unavailable".to_owned(),
            source_url: request.url.clone(),
        });
        assert_eq!(
            execute_provider_request(&mut transport, &request),
            Err(ProviderExecutionError::NonSuccessStatus(503))
        );

        transport.response = Ok(ProviderTransportResponse {
            status: 200,
            body: "{}".to_owned(),
            source_url: "https://example.invalid/forged".to_owned(),
        });
        assert_eq!(
            execute_provider_request(&mut transport, &request),
            Err(ProviderExecutionError::ProvenanceMismatch)
        );
    }

    #[test]
    fn matches_the_shared_json_fixture() {
        let fixture: Fixture = serde_json::from_str(FIXTURE).expect("valid compatibility fixture");
        assert_eq!(fixture.cli_binaries, CLI_BINARIES);
        assert_eq!(fixture.mcp_binaries, MCP_BINARIES);
        assert_eq!(fixture.commands, COMMANDS);
        assert_eq!(fixture.provider_identifiers, PROVIDER_IDENTIFIERS);
    }

    #[test]
    fn validates_binary_command_and_provider_contracts() {
        assert_eq!(classify_binary("legislation"), Some(BinaryKind::Cli));
        assert_eq!(classify_binary("legislation-mcp"), Some(BinaryKind::Mcp));
        assert_eq!(classify_binary("unknown"), None);
        assert!(is_supported_command("search"));
        assert!(!is_supported_command("unknown"));
        assert!(is_supported_provider("au-commonwealth"));
        assert!(!is_supported_provider("au-nsw"));
    }

    #[test]
    fn blocks_unsupported_or_unbacked_capabilities_structurally() {
        let capability = FeatureCapability {
            status: CapabilityStatus::Unsupported,
            source_backed: false,
            notes: "source validation required".to_owned(),
        };
        let error = require_capability("au-nsw", "nsw", ProviderFeature::Search, &capability)
            .expect_err("unsupported capability must be blocked");
        assert_eq!(error.error, "unsupported_provider_capability");
        assert_eq!(error.jurisdiction, "au-nsw");
        assert_eq!(error.feature, ProviderFeature::Search);
    }

    #[test]
    fn permits_source_backed_prerelease_capabilities() {
        let capability = FeatureCapability {
            status: CapabilityStatus::Prerelease,
            source_backed: true,
            notes: "source-backed prerelease".to_owned(),
        };
        assert!(require_capability(
            "au-commonwealth",
            "federal-register-of-legislation",
            ProviderFeature::Search,
            &capability
        )
        .is_ok());
    }

    #[test]
    fn parses_supported_command_and_output_contracts() {
        let request = parse_command_args([
            "search",
            "--format",
            "json",
            "--jurisdiction",
            "au-commonwealth",
        ])
        .expect("valid command contract");
        assert_eq!(request.command, "search");
        assert_eq!(request.format, OutputFormat::Json);
        assert_eq!(request.jurisdiction.as_deref(), Some("au-commonwealth"));
    }

    #[test]
    fn rejects_invalid_command_format_and_options() {
        assert_eq!(
            parse_command_args(["unknown"]),
            Err(CliContractError::UnsupportedCommand("unknown".to_owned()))
        );
        assert_eq!(
            parse_command_args(["search", "--format", "xml"]),
            Err(CliContractError::UnsupportedFormat("xml".to_owned()))
        );
        assert_eq!(
            parse_command_args(["search", "--nope"]),
            Err(CliContractError::UnsupportedOption("--nope".to_owned()))
        );
    }

    #[test]
    fn validates_mcp_requests_and_round_trips_provenance_response() {
        let request = McpRequest {
            tool: "search_legislation".to_owned(),
            jurisdiction: "nz".to_owned(),
        };
        assert!(validate_mcp_request(&request).is_ok());
        let response = McpResponse {
            tool: request.tool,
            jurisdiction: request.jurisdiction,
            release_gate: GateStatus::Allowed,
            submission_gate: GateStatus::Allowed,
            provenance: Some(ProvenanceMetadata {
                source_authority: "legislation.govt.nz".to_owned(),
                source_url: None,
                retrieved_at: None,
                source_backed: true,
            }),
            error: None,
        };
        let encoded = serde_json::to_string(&response).expect("serializable MCP response");
        let decoded: McpResponse = serde_json::from_str(&encoded).expect("valid MCP response");
        assert_eq!(decoded, response);
    }
}
