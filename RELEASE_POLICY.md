# Release Policy

## Purpose

This document defines how `nz-legislation-tool` is versioned, released, and communicated.

**The npm package version is the canonical product version.** All public contracts are governed by that version.

## Stable Baseline

**Current Stable Line:** `v1.2.x` (NZ CLI + MCP)
**Current Prerelease Lane:** `next` (approved prerelease work only)
**Next Major Line:** reserved for the first true breaking contract shift

The MCP surface shipped as a backward-compatible addition in `1.2.0`. Future
multi-jurisdiction work should stay on the `v1.x` line unless it breaks a
supported public contract.

## Release Channels

### Stable

- Branch: `main`
- Workflow: `Release Stable`
- npm dist-tag: `latest`
- Intended audience: all users

### Prerelease

- Branch: `next`
- Workflow: `Release Next`
- npm dist-tag: `next`
- Intended audience: early adopters and maintainers validating approved prerelease work

`next` is a governed prerelease lane, not an automatic promise of a major
release. It may be used for additive work that is not yet ready for the stable
line.

## Versioning Rules

### Major (Breaking Changes)

Use a major release when a change breaks a supported public contract, including:

- CLI command names or removal of supported flags
- Output contract changes that break documented stable usage
- MCP tool name, schema, or behavioral breaks
- Future published OpenAPI endpoint or schema breaks
- Removal or breaking changes to exported types or interfaces
- Configuration key changes or default behavior changes

**Examples:**

- `1.2.0` → `2.0.0` (breaking provider interface or CLI/MCP contract shift)
- `2.0.0` → `3.0.0` (new breaking public platform line)

### Minor (Backward-Compatible Features)

Use a minor release for backward-compatible feature additions, including:

- New CLI commands or subcommands
- New CLI flags (optional, non-breaking)
- New MCP tools or additive MCP fields
- Additive API adapter endpoints or fields
- New export formats
- Performance improvements that preserve behavior

**Examples:**

- `1.1.0` → `1.2.0` (ship MCP as an additive public surface)
- `1.2.0` → `1.3.0` (ship additive Australian jurisdiction support)

### Patch (Backward-Compatible Fixes)

Use a patch release for fixes that do not break a supported public contract, including:

- Bug fixes
- Internal refactors with no behavioral change
- Documentation corrections
- Performance improvements that preserve behavior
- Security patches
- Error message improvements

**Examples:**

- `2.0.0` → `2.0.1` (fix API timeout handling)
- `2.0.1` → `2.0.2` (correct error logging path)

### Prerelease Versions

Prerelease versions follow SemVer prerelease notation:

- Format: `X.Y.Z-next.N` (e.g., `1.3.0-next.0`, `2.0.0-next.0`)
- Published to npm with `next` dist-tag
- Used for prerelease incubation on `next` branch
- Not guaranteed stable; may contain breaking changes between prereleases

**Examples:**

- `1.3.0-next.0` (first prerelease of additive Australian support)
- `2.0.0-next.0` (first prerelease of a breaking future line)

## Release Artifacts

Every user-facing change should include a changeset unless it is explicitly release-neutral.

The canonical workflow set is:

- `CI`
- `Release Stable`
- `Release Next`
- `docs.yml`
- `publish-github-packages.yml`
- security workflows

Legacy release and CI workflows are retained as manual-only paths until they are fully removed.

---

## Compatibility Matrix

### Stable Guarantees (v1.x, v2.x)

| Contract                  | Guarantee                                           | Scope                                |
| ------------------------- | --------------------------------------------------- | ------------------------------------ |
| **CLI Commands**          | Stable command names, flags, and help output        | All documented commands              |
| **CLI Output**            | Stable machine-parseable output formats (JSON, CSV) | `--format json`, `--format csv`      |
| **CLI Exit Codes**        | `0` success, `1` user error, `2` system error       | All commands                         |
| **MCP Tools**             | Stable tool names, schemas, and response shapes     | All registered MCP tools             |
| **MCP Protocol**          | MCP handshake and transport protocol                | Per MCP SDK spec                     |
| **Configuration**         | Stable config keys and defaults                     | `~/.nz-legislation-tool/config.json` |
| **Environment Variables** | Stable required and optional env vars               | `NZ_LEGISLATION_*`                   |

### Provisional Guarantees (prerelease incubation)

| Contract               | Guarantee                                      | Scope                              |
| ---------------------- | ---------------------------------------------- | ---------------------------------- |
| **Provider Interface** | Plugin interface stable within prerelease lane | Subject to change before v3 stable |
| **HTTP Adapter**       | REST endpoints stable within prerelease lane   | `/search`, `/act/{name}`, etc.     |
| **OpenAPI Schema**     | Auto-generated from HTTP adapter               | Subject to change before v3 stable |

### Internal (Release-Neutral)

The following are considered internal and may change without major version bump:

- Internal module structure and exports
- Error message text (non-parseable output)
- Logging format and log file locations
- Test infrastructure and test helpers
- Build tooling and configuration
- Documentation structure

---

## Contract Enforcement

### CLI Contract Tests

The following are validated in CI:

- Command help output stability
- Representative output snapshots (JSON, CSV)
- Exit code behavior for error paths
- Flag parsing and validation

### MCP Contract Tests

The following are validated in CI:

- MCP handshake protocol
- Tool list registration
- Schema validation for inputs/outputs
- Packaged smoke tests for MCP server

### Breaking Change Approval

Intentional breaking changes require:

1. Explicit `major` changeset
2. Documentation of migration path
3. Release captain approval
4. Update to compatibility matrix

---

## External Operating Surfaces

### README and Documentation

- Opening section presents CLI and MCP as separate entry points
- Quick-start blocks for both CLI and MCP users
- Package names and install commands are unambiguous

### Repository Topology

- **Current:** Single repository (`nz-legislation`) with child repos (`nz-legislation-tool`, `research-conductor`)
- **Future:** Potential split into dedicated CLI and MCP repositories if needed

### AI-Facing Access Layer (Future)

Evaluated for v3 scope:

- REST adapter optimized for GPT Actions, Gemini, LangChain, LlamaIndex, RAG
- Endpoints: `/search?q=`, `/act/{name}`, `/section/{act}/{section}`, `/cite/{act}/{section}`, etc.
- OpenAPI contract surface at `/openapi.json`
- Implementation: FastAPI recommended for automatic OpenAPI generation

Any future HTTP or OpenAPI surface must enter through the governed prerelease
lane first. It should not be treated as stable until all of the following are
true:

- route and schema contracts are documented
- OpenAPI output is generated automatically and checked in CI
- response metadata includes source attribution and contract-stable identifiers
- CLI and MCP compatibility implications are reviewed explicitly

---

## Product vs Research Boundary

### Product-Owned (`nz-legislation-tool`)

- CLI tool and MCP server
- API client and data models
- Output formatters and export functionality
- Configuration management
- Documentation site

### Research-Owned (`research-conductor`)

- NZMJ research programme tracks
- Health legislation analysis methodology
- Research protocol and ethics documentation
- Academic publication workflows

### Shared Resources

- NZ Legislation API access
- Parent repository coordination docs
- GitHub Actions infrastructure

### Boundary Guardrails

- Research-only changes do not trigger product release logic
- Product homepages and package docs remain separate from research artefacts
- Each child repository has its own Conductor root and local governance

## Package Registry Policy

- Canonical public npm package: `nz-legislation-tool`
- GitHub Packages mirror: `@edithatogo/nz-legislation-tool`

The GitHub Packages mirror exists for repository package visibility and ecosystem convenience. npm remains the canonical installation target unless this policy is revised.

## Release Checklist

Before stable release:

1. Merge approved changes to `main`.
2. Ensure changesets correctly reflect release intent.
3. Confirm CI is green.
4. Let `Release Stable` create the release PR or publish.

Before prerelease:

1. Merge approved prerelease work to `next`.
2. Confirm prerelease intent and branch scope.
3. Confirm CI is green.
4. Let `Release Next` publish to the `next` dist-tag.

## Hotfix Policy

Urgent stable fixes should target `main` and use the stable release path. Do not bypass the stable workflow with ad hoc tag pushes unless the stable workflow is unavailable and the fallback is explicitly documented.
