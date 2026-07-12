//! Language-neutral compatibility constants for the staged Rust migration.
//!
//! This crate contains only language-neutral validation, not a CLI, MCP server,
//! provider, or legal-data runtime. It is the first executable component of the
//! staged migration and remains non-publishing until parity gates pass.

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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CapabilityStatus {
    Supported,
    Prerelease,
    Unsupported,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProviderFeature {
    Search,
    GetWork,
    GetVersions,
    GetVersion,
    Citation,
    Export,
    Mcp,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FeatureCapability {
    pub status: CapabilityStatus,
    pub source_backed: bool,
    pub notes: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnsupportedProviderCapability {
    pub error: &'static str,
    pub jurisdiction: String,
    pub provider_id: String,
    pub feature: ProviderFeature,
    pub status: CapabilityStatus,
    pub source_backed: bool,
    pub message: String,
}

pub fn require_capability(
    jurisdiction: &str,
    provider_id: &str,
    feature: ProviderFeature,
    capability: &FeatureCapability,
) -> Result<(), UnsupportedProviderCapability> {
    if capability.status == CapabilityStatus::Unsupported || !capability.source_backed {
        return Err(UnsupportedProviderCapability {
            error: "unsupported_provider_capability",
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

    const FIXTURE: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/rust/cli-contracts.json"
    ));

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
}
