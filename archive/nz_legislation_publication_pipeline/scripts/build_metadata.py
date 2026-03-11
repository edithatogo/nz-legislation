"""Build a simple metadata table from harvested legislation records."""
from __future__ import annotations
import csv

FIELDS = ["work_id", "title", "type", "date_first_valid", "date_last_valid", "status", "administering_agency"]

def write_metadata(rows: list[dict], output_path: str) -> None:
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in FIELDS})
