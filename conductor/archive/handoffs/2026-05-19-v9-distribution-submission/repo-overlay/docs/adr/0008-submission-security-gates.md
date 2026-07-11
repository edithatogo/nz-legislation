# ADR 0008: Require Security and Truthfulness Gates Before Registry Submission

## Status

Proposed

## Context

MCP registries, package registries, and IDE/plugin marketplaces are discovery and trust surfaces. Premature submission can spread inaccurate legal-data claims or unsafe install patterns.

## Decision

Do not submit to external registries or marketplaces until the following gates pass:

1. no-placeholder legal data
2. provider capability manifest
3. source/provenance cards
4. MCP/export provider routing
5. package provenance
6. secret/API-key handling review
7. listing copy review

## Consequences

- Launch may be slower, but credibility improves.
- Registry listings reflect actual runtime behavior.
- Users get safer install instructions.
