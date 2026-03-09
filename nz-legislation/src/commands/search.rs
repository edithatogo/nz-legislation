//! Search command implementation.

use clap::Args;
use crate::{config::Config, error::Result, output::{self, OutputFormat}};

/// Search for legislation.
#[derive(Debug, Args)]
pub struct CmdSearch {
    /// Search query
    #[arg(short, long)]
    pub query: Option<String>,

    /// Filter by type (act, bill, regulation, instrument)
    #[arg(short, long)]
    pub r#type: Option<String>,

    /// Filter by status (in-force, repealed, etc.)
    #[arg(short, long)]
    pub status: Option<String>,

    /// Filter from date (YYYY-MM-DD)
    #[arg(long, value_name = "DATE")]
    pub from: Option<String>,

    /// Filter to date (YYYY-MM-DD)
    #[arg(long, value_name = "DATE")]
    pub to: Option<String>,

    /// Maximum results (default: 25, max: 100)
    #[arg(short, long, default_value = "25")]
    pub limit: usize,

    /// Result offset for pagination
    #[arg(short, long, default_value = "0")]
    pub offset: usize,
}

impl CmdSearch {
    /// Execute the search command.
    pub async fn execute(
        &self,
        api_key: &str,
        base_url: &str,
        format: &OutputFormat,
    ) -> Result<()> {
        // Load configuration
        let config = Config::load_with_overrides(Some(api_key.to_string()), Some(base_url.to_string()))?;

        // Create API client
        let client = crate::client::ApiClient::new(config)?;

        // Validate limit
        let limit = self.limit.min(100);

        // Execute search
        let results = client
            .search(
                self.query.as_deref(),
                self.r#type.as_deref(),
                self.status.as_deref(),
                self.from.as_deref(),
                self.to.as_deref(),
                Some(limit),
                Some(self.offset),
            )
            .await?;

        // Output results
        match format {
            OutputFormat::Table => output::print_work_table(&results),
            OutputFormat::Json => output::print_json(&results)?,
            OutputFormat::Csv => output::print_work_csv(&results)?,
        }

        Ok(())
    }
}
