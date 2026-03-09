//! NZ Legislation CLI - A robust command-line tool for accessing New Zealand legislation data.
//!
//! This tool provides search, retrieval, and export capabilities for NZ legislation.
//! Built with Rust for performance, safety, and reliability.

mod commands;
mod config;
mod error;
mod client;
mod models;
mod output;

use clap::Parser;
use commands::{CmdGet, CmdSearch, CmdExport};
use tracing_subscriber::{self, EnvFilter};

/// NZ Legislation CLI - Access and search New Zealand legislation data
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    /// Output format: table, json, csv
    #[arg(short, long, value_enum, default_value = "table", global = true)]
    format: OutputFormat,

    /// API key (can also be set via NZ_LEGISLATION_API_KEY env var)
    #[arg(short, long, env = "NZ_LEGISLATION_API_KEY")]
    api_key: Option<String>,

    /// API base URL (can also be set via NZ_LEGISLATION_BASE_URL env var)
    #[arg(long, env = "NZ_LEGISLATION_BASE_URL", default_value = "https://api.legislation.govt.nz")]
    base_url: String,

    /// Enable verbose output
    #[arg(short, long, global = true)]
    verbose: bool,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Debug, Clone, clap::ValueEnum)]
enum OutputFormat {
    Table,
    Json,
    Csv,
}

#[derive(Debug, Parser)]
enum Commands {
    /// Search for legislation
    Search(CmdSearch),

    /// Get legislation by ID
    Get(CmdGet),

    /// Export search results to file
    Export(CmdExport),
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // Initialize logging
    let log_level = if cli.verbose { "debug" } else { "info" };
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive(log_level.parse()?))
        .with_target(false)
        .with_thread_ids(false)
        .with_thread_names(false)
        .init();

    // Validate API key
    let api_key = cli.api_key.ok_or_else(|| {
        anyhow::anyhow!(
            "API key required. Set --api-key or NZ_LEGISLATION_API_KEY environment variable"
        )
    })?;

    // Execute command
    match cli.command {
        Commands::Search(cmd) => cmd.execute(&api_key, &cli.base_url, &cli.format).await,
        Commands::Get(cmd) => cmd.execute(&api_key, &cli.base_url, &cli.format).await,
        Commands::Export(cmd) => cmd.execute(&api_key, &cli.base_url).await,
    }
}
