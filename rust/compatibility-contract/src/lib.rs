//! Language-neutral compatibility constants for the staged Rust migration.
//!
//! This crate deliberately contains no CLI, MCP server, provider, or legal-data
//! runtime. It is a compile-and-test gate that makes the migration contract
//! executable before implementation work begins.

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

#[cfg(test)]
mod tests {
    use serde::Deserialize;

    use super::*;

    #[derive(Deserialize)]
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
}
