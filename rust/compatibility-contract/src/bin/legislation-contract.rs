use legislation_compatibility_contract::parse_command_args;
use serde::Serialize;

#[derive(Serialize)]
struct ContractOutput {
    runtime: &'static str,
    command: String,
    format: &'static str,
    jurisdiction: Option<String>,
}

fn main() {
    let request = parse_command_args(std::env::args().skip(1)).unwrap_or_else(|error| {
        eprintln!("invalid compatibility command: {error:?}");
        std::process::exit(2);
    });
    let format = match request.format {
        legislation_compatibility_contract::OutputFormat::Table => "table",
        legislation_compatibility_contract::OutputFormat::Json => "json",
        legislation_compatibility_contract::OutputFormat::Csv => "csv",
    };
    let output = ContractOutput {
        runtime: "rust-compatibility-contract",
        command: request.command,
        format,
        jurisdiction: request.jurisdiction,
    };
    println!(
        "{}",
        serde_json::to_string(&output).expect("contract output serializes")
    );
}
