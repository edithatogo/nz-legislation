"""Basic XML parsing helpers for legislation documents."""
from __future__ import annotations
from lxml import etree

def parse_xml_file(path: str):
    return etree.parse(path)

def extract_text(root) -> str:
    return " ".join(root.xpath("//text()"))

def count_terms(text: str, terms: list[str]) -> dict[str, int]:
    lower = text.lower()
    return {term: lower.count(term.lower()) for term in terms}
