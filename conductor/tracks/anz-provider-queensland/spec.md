# Spec: Queensland Provider

## Purpose

Implement Queensland legislation support from the official Queensland
Legislation API service after registration, access review, Swagger capture, and
source-backed fixture work are complete.

## Requirements

### R1: Official API access

Queensland implementation must use the official API service and comply with its
access agreement, registration requirements, rate limits, licence terms, and
format constraints.

### R2: No placeholder behavior

The legacy empty/stub Queensland behavior must not be exposed as support.
Unsupported or incomplete features must return structured capability errors.

### R3: Capability gate

`au-qld` must remain unsupported in the provider capability manifest until
source-backed adapter behavior, tests, source cards, docs, and release notes are
complete.

### R4: Provider-aware routing

CLI, MCP, and export behavior must be jurisdiction-aware and must not route
Queensland requests through New Zealand or Commonwealth providers.

### R5: Provenance

Queensland outputs must carry source authority, source URL, retrieval metadata,
and format information sufficient for users to understand where the legal data
came from.

## Non-goals

- publishing packages
- deploying documentation
- submitting marketplace or registry listings
- storing API credentials in the repository
- enabling Queensland runtime support before access and release gates pass
