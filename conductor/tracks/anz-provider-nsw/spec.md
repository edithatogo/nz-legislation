# Spec: NSW Provider

## Purpose

Design and implement New South Wales legislation support around the official NSW
XML/export surface, treating it as an export/download source until adapter work
proves which runtime contracts can be supported.

## Requirements

### R1: Export/download source model

NSW implementation must start from official XML export and JSON listing routes,
not from an assumed conventional search API.

### R2: No placeholder behavior

The provider must not invent search, version, citation, or export behavior.
Unsupported feature boundaries must remain explicit in the capability manifest
and runtime errors.

### R3: Provider-aware routing

CLI, MCP, and export behavior must use jurisdiction-aware provider routing and
must never fall back to New Zealand data for NSW requests.

### R4: Provenance

NSW outputs must preserve source URL, export query details, retrieved XML
metadata, version/date context, and authoritative-source notes.

### R5: Automation constraints

Live smoke tests and scripted access must respect NSW guidance, including timing
expectations for automated processing where practical.

## Non-goals

- publishing packages
- deploying docs
- registry or marketplace submission
- claiming full NSW search support before adapter capability is proven
