"""Starter client for the NZ legislation API."""
from __future__ import annotations
import requests

BASE_URL = "https://www.legislation.govt.nz/api/v1"

def search_works(query: str, page: int = 1) -> dict:
    params = {"query": query, "page": page}
    r = requests.get(f"{BASE_URL}/works", params=params, timeout=30)
    r.raise_for_status()
    return r.json()

def get_versions(work_id: str) -> dict:
    r = requests.get(f"{BASE_URL}/works/{work_id}/versions", timeout=30)
    r.raise_for_status()
    return r.json()

def get_version(version_id: str) -> dict:
    r = requests.get(f"{BASE_URL}/versions/{version_id}", timeout=30)
    r.raise_for_status()
    return r.json()
