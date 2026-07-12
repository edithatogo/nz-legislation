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
}
