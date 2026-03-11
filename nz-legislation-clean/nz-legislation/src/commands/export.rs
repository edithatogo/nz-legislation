//! Export command implementation.

use clap::Args;
use std::path::PathBuf;
use crate::config::Config;
use crate::error::Result;

/// Export search results to file.
#[derive(Debug, Args)]
pub struct CmdExport {
    /// Search query
    #[arg(short, long)]
    pub query: String,

    /// Output file path
    #[arg(short, long)]
    pub output: PathBuf,

    /// Output format (json, csv)
    #[arg(short, long, value_enum, default_value = "csv")]
    pub format: ExportFormat,

    /// Filter by type
    #[arg(short, long)]
    pub r#type: Option<String>,

    /// Filter by status
    #[arg(short, long)]
    pub status: Option<String>,

    /// Maximum results to export
    #[arg(short, long, default_value = "1000")]
    pub limit: usize,
}

#[derive(Debug, Clone, clap::ValueEnum)]
pub enum ExportFormat {
    Json,
    Csv,
}

impl CmdExport {
    /// Execute the export command.
    pub async fn execute(&self, api_key: &str, base_url: &str) -> Result<()> {
        // Load configuration
        let config = Config::load_with_overrides(Some(api_key.to_string()), Some(base_url.to_string()))?;

        // Create API client
        let client = crate::client::ApiClient::new(config)?;

        // Execute search
        let results = client
            .search(
                &self.query,
                self.r#type.as_deref(),
                self.status.as_deref(),
                None,
                None,
                Some(self.limit),
                None,
            )
            .await?;

        // Ensure output directory exists
        if let Some(parent) = self.output.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Write to file
        match self.format {
            ExportFormat::Json => {
                let json = serde_json::to_string_pretty(&results)?;
                std::fs::write(&self.output, json)?;
            }
            ExportFormat::Csv => {
                let mut wtr = csv::Writer::from_path(&self.output)?;
                for item in &results.results {
                    wtr.serialize(item)?;
                }
                wtr.flush()?;
            }
        }

        println!(
            "Exported {} results to {}",
            results.results.len(),
            self.output.display()
        );

        Ok(())
    }
}
