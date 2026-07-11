# Spec: Container and Homebrew Distribution

## Scope

Record Docker/GHCR and Homebrew contracts before any image, tap, or formula is
created or published.

## Requirements

- Define entry points, build inputs, provenance, and install snippets before
  implementation.
- Keep container and Homebrew work in this repository.
- Do not push GHCR images or publish Homebrew formulae until all gates pass.

## Contracts

- **Artifact:** future Dockerfiles, image metadata, formula guidance, and install
  snippets must match package entry points and provider capability.
- **Submission:** no GHCR push, Docker image publication, tap, or formula
  publication until release gates pass.
- **Claims:** copy must match package metadata and distinguish NZ stable from AU
  prerelease/planned support.
