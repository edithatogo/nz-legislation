//! Get command implementation.

use clap::Args;
use crate::{config::Config, error::Result, output::{self, OutputFormat}};

/// Get legislation by ID.
#[derive(Debug, Args)]
pub struct CmdGet {
    /// Work ID (e.g., "act/2020/67" or "2020-67")
    #[arg(required = true)]
    pub id: String,

    /// Get version history
    #[arg(short, long)]
    pub versions: bool,
}

impl CmdGet {
    /// Execute the get command.
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

        if self.versions {
            // Get version history
            let versions = client.get_versions(&self.id).await?;
            
            match format {
                OutputFormat::Table => output::print_version_table(&versions),
                OutputFormat::Json => output::print_json(&versions)?,
                OutputFormat::Csv => output::print_version_csv(&versions)?,
            }
        } else {
            // Get work details
            let work = client.get_work(&self.id).await?;

            // Output results
            match format {
                OutputFormat::Table => output::print_work_detail(&work),
                OutputFormat::Json => output::print_json(&work)?,
                OutputFormat::Csv => {
                    // For single item, create a search results wrapper
                    let results = crate::models::SearchResults {
                        total: 1,
                        offset: 0,
                        limit: 1,
                        results: vec![work],
                        links: None,
                    };
                    output::print_work_csv(&results)?;
                }
            }
        }

        Ok(())
    }
}
