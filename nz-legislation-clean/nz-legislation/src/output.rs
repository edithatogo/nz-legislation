//! Output formatting for CLI results.

use crate::models::{LegislationWork, SearchResults, Version};
use comfy_table::{Table, Cell, Color, Attribute};
use serde::Serialize;

/// Output format enumeration.
pub enum OutputFormat {
    Table,
    Json,
    Csv,
}

/// Print search results (works) as a table.
pub fn print_work_table(results: &SearchResults) -> Result<(), crate::error::NzLegislationError> {
    if results.results.is_empty() {
        println!("No results found.");
        return Ok(());
    }

    let mut table = Table::new();
    table
        .load_preset(comfy_table::presets::UTF8_FULL)
        .set_header(vec![
            Cell::new("ID").add_attribute(Attribute::Bold),
            Cell::new("Title").add_attribute(Attribute::Bold),
            Cell::new("Type").add_attribute(Attribute::Bold),
            Cell::new("Status").add_attribute(Attribute::Bold),
            Cell::new("Date").add_attribute(Attribute::Bold),
        ]);

    for work in &results.results {
        let type_color = match work.work_type {
            crate::models::WorkType::Act => Color::Cyan,
            crate::models::WorkType::Bill => Color::Magenta,
            crate::models::WorkType::Regulation => Color::Yellow,
            crate::models::WorkType::Instrument => Color::White,
            crate::models::WorkType::Unknown => Color::White,
        };

        let status_color = match work.status {
            crate::models::LegislationStatus::InForce => Color::Green,
            crate::models::LegislationStatus::NotYetInForce => Color::Yellow,
            crate::models::LegislationStatus::Repealed => Color::Red,
            crate::models::LegislationStatus::PartiallyRepealed => Color::Yellow,
            crate::models::LegislationStatus::Withdrawn => Color::Red,
            crate::models::LegislationStatus::Unknown => Color::White,
        };

        table.add_row(vec![
            Cell::new(&work.id),
            Cell::new(&work.title).max_width(50),
            Cell::new(format!("{:?}", work.work_type)).fg(type_color),
            Cell::new(format!("{:?}", work.status)).fg(status_color),
            Cell::new(work.date.format("%Y-%m-%d")),
        ]);
    }

    println!("{}", table);
    println!("\nTotal: {} results (showing {})", results.total, results.results.len());

    Ok(())
}

/// Print a single work details as a table.
pub fn print_work_detail(work: &LegislationWork) -> Result<(), crate::error::NzLegislationError> {
    let mut table = Table::new();
    table
        .load_preset(comfy_table::presets::UTF8_FULL)
        .set_header(vec![
            Cell::new("Property").add_attribute(Attribute::Bold).fg(Color::Cyan),
            Cell::new("Value").add_attribute(Attribute::Bold),
        ]);

    table.add_row(vec![
        Cell::new("ID"),
        Cell::new(&work.id),
    ]);

    table.add_row(vec![
        Cell::new("Title"),
        Cell::new(&work.title),
    ]);

    if let Some(short_title) = &work.short_title {
        table.add_row(vec![
            Cell::new("Short Title"),
            Cell::new(short_title),
        ]);
    }

    table.add_row(vec![
        Cell::new("Type"),
        Cell::new(format!("{:?}", work.work_type)),
    ]);

    table.add_row(vec![
        Cell::new("Status"),
        Cell::new(format!("{:?}", work.status)),
    ]);

    table.add_row(vec![
        Cell::new("Date"),
        Cell::new(work.date.format("%Y-%m-%d").to_string()),
    ]);

    table.add_row(vec![
        Cell::new("Versions"),
        Cell::new(work.version_count.to_string()),
    ]);

    table.add_row(vec![
        Cell::new("URL"),
        Cell::new(&work.url),
    ]);

    println!("{}", table);

    Ok(())
}

/// Print version list as a table.
pub fn print_version_table(versions: &[Version]) -> Result<(), crate::error::NzLegislationError> {
    if versions.is_empty() {
        println!("No versions found.");
        return Ok(());
    }

    let mut table = Table::new();
    table
        .load_preset(comfy_table::presets::UTF8_FULL)
        .set_header(vec![
            Cell::new("ID").add_attribute(Attribute::Bold),
            Cell::new("Version").add_attribute(Attribute::Bold),
            Cell::new("Type").add_attribute(Attribute::Bold),
            Cell::new("Date").add_attribute(Attribute::Bold),
            Cell::new("Current").add_attribute(Attribute::Bold),
            Cell::new("Formats").add_attribute(Attribute::Bold),
        ]);

    for version in versions {
        let current_str = if version.is_current { "Yes" } else { "No" };
        let formats_str = version.formats.join(", ");

        table.add_row(vec![
            Cell::new(&version.id),
            Cell::new(version.version.to_string()),
            Cell::new(&version.version_type),
            Cell::new(version.date.format("%Y-%m-%d")),
            Cell::new(current_str),
            Cell::new(&formats_str),
        ]);
    }

    println!("{}", table);
    println!("\nTotal versions: {}", versions.len());

    Ok(())
}

/// Print results as JSON.
pub fn print_json<T: Serialize>(data: &T) -> Result<(), crate::error::NzLegislationError> {
    let json = serde_json::to_string_pretty(data)?;
    println!("{}", json);
    Ok(())
}

/// Print work results as CSV.
pub fn print_work_csv(results: &SearchResults) -> Result<(), crate::error::NzLegislationError> {
    let mut wtr = csv::Writer::from_writer(std::io::stdout());

    // Write header
    wtr.write_record(&["id", "title", "short_title", "type", "status", "date", "url", "versions"])?;

    // Write records
    for work in &results.results {
        wtr.write_record(&[
            &work.id,
            &work.title,
            work.short_title.as_deref().unwrap_or(""),
            &format!("{:?}", work.work_type),
            &format!("{:?}", work.status),
            &work.date.format("%Y-%m-%d").to_string(),
            &work.url,
            &work.version_count.to_string(),
        ])?;
    }

    wtr.flush()?;
    Ok(())
}

/// Print version list as CSV.
pub fn print_version_csv(versions: &[Version]) -> Result<(), crate::error::NzLegislationError> {
    let mut wtr = csv::Writer::from_writer(std::io::stdout());

    // Write header
    wtr.write_record(&["id", "version", "type", "date", "is_current", "formats"])?;

    // Write records
    for version in versions {
        let formats_str = version.formats.join(";");
        wtr.write_record(&[
            &version.id,
            &version.version.to_string(),
            &version.version_type,
            &version.date.format("%Y-%m-%d").to_string(),
            &version.is_current.to_string(),
            &formats_str,
        ])?;
    }

    wtr.flush()?;
    Ok(())
}
