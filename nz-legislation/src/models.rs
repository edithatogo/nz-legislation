//! Data models for NZ Legislation API.
//!
//! Based on the FRBR-inspired model used by the NZ Legislation API:
//! - Work: An Act, Bill, or other legislative instrument
//! - Version: A specific version of a work (as at a date, or reading version)
//! - Format: Different formats of a version (XML, PDF, HTML)
//!
//! API Documentation: https://api.legislation.govt.nz/docs/

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

/// Type of legislation work.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum WorkType {
    Act,
    Bill,
    Regulation,
    Instrument,
    #[serde(other)]
    Unknown,
}

/// Status of legislation.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum LegislationStatus {
    InForce,
    NotYetInForce,
    Repealed,
    PartiallyRepealed,
    Withdrawn,
    #[serde(other)]
    Unknown,
}

/// A legislation Work (Act, Bill, etc.).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegislationWork {
    /// Unique work identifier.
    pub id: String,

    /// Title of the work.
    pub title: String,

    /// Short title for citation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_title: Option<String>,

    /// Type of work (act, bill, etc.).
    #[serde(rename = "type")]
    pub work_type: WorkType,

    /// Current status.
    pub status: LegislationStatus,

    /// Date enacted or introduced.
    #[serde(with = "naive_date_format")]
    pub date: NaiveDate,

    /// URL for this work.
    #[serde(rename = "self")]
    pub url: String,

    /// Number of versions available.
    #[serde(default)]
    pub version_count: usize,
}

/// A specific version of a work.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Version {
    /// Version identifier.
    pub id: String,

    /// Version number.
    pub version: usize,

    /// Date this version was published.
    #[serde(with = "naive_date_format")]
    pub date: NaiveDate,

    /// Whether this is the current version.
    #[serde(default)]
    pub is_current: bool,

    /// Version type (e.g., "as-at", "reprint", "original").
    #[serde(rename = "type")]
    pub version_type: String,

    /// Available formats (xml, pdf, html).
    pub formats: Vec<String>,
}

/// A specific version of legislation with full content.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegislationVersion {
    /// Version identifier.
    pub id: String,

    /// Work ID this version belongs to.
    pub work_id: String,

    /// Title of the work.
    pub title: String,

    /// Version number.
    pub version: usize,

    /// Date this version was published.
    #[serde(with = "naive_date_format")]
    pub date: NaiveDate,

    /// Whether this is the current version.
    #[serde(default)]
    pub is_current: bool,

    /// Content of the version (if requested).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Available formats.
    pub formats: Vec<FormatInfo>,
}

/// Format information for a version.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormatInfo {
    /// Format type (xml, pdf, html).
    pub format: String,

    /// URL to access this format.
    pub url: String,

    /// File size in bytes (if available).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size: Option<usize>,
}

/// Search results from the API.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResults {
    /// Total number of results.
    pub total: usize,

    /// Current offset.
    #[serde(default)]
    pub offset: usize,

    /// Limit used.
    #[serde(default)]
    pub limit: usize,

    /// Search results (works).
    pub results: Vec<LegislationWork>,

    /// Links to next/previous pages.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub links: Option<PaginationLinks>,
}

/// Pagination links.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaginationLinks {
    /// URL for next page.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,

    /// URL for previous page.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prev: Option<String>,
}

// Custom date format for serialization
mod naive_date_format {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer, Serializer};

    const FORMAT: &str = "%Y-%m-%d";

    pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}
