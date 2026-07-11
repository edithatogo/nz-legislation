---
title: Docs tooling audit
description: Local documentation tooling status and migration decision.
---

# Docs tooling audit

## Decision

This repo owns local documentation through `docs-site/`, using Astro, Starlight, MDX, and Sitemap.

## Commands

- `docs:dev` delegates to `docs-site` for local preview.
- `docs:build` builds the static Astro site.
- `docs:check` runs `astro check` for documentation type/config validation.

## Existing sources

Existing Markdown docs under docs/ plus TypeDoc API output as source material.

## CI

`.github/workflows/docs.yml` installs the docs app dependencies, runs `docs:check`, and then runs `docs:build`.

## Migration note

Legacy generators remain source generators only. Published documentation should converge through this Astro/Starlight app.
