# Conductor Tracks

This registry lists active delivery tracks in this repository. The umbrella
release/distribution track remains the source of truth for publication,
submission, registry, and marketplace gates.

## Umbrella track

| Track                                   | Priority | Status | Purpose                                                                                                      |
| --------------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `anz-platform-release-and-distribution` | P0       | Active | Single-repository release, distribution, submission, integration, provider-gate, and Rust-readiness roadmap. |

## Provider implementation tracks

All Australian provider tracks are implementation backlogs only. They do not
make runtime support release-ready, do not permit publishing or registry
submission, and must keep unsupported provider capability errors until their
source-backed gates pass.

| Track                             | Jurisdiction                 | Priority | Current phase                                                               |
| --------------------------------- | ---------------------------- | -------- | --------------------------------------------------------------------------- |
| `anz-provider-commonwealth`       | Australian Commonwealth      | P0       | Adapter foundation, source metadata, registry wiring, and runtime-gate work |
| `anz-provider-queensland`         | Queensland                   | P0       | API access and source-backed adapter                                        |
| `anz-provider-nsw`                | New South Wales              | P1       | XML/export adapter design                                                   |
| `anz-provider-victoria`           | Victoria                     | P1       | Source-shape discovery and adapter mapping                                  |
| `anz-provider-south-australia`    | South Australia              | P1       | Source-shape discovery and adapter mapping                                  |
| `anz-provider-western-australia`  | Western Australia            | P1       | Source-shape discovery and adapter mapping                                  |
| `anz-provider-tasmania`           | Tasmania                     | P1       | Source-shape discovery and adapter mapping                                  |
| `anz-provider-act`                | Australian Capital Territory | P1       | Source-shape discovery and adapter mapping                                  |
| `anz-provider-northern-territory` | Northern Territory           | P1       | Source-shape discovery and adapter mapping                                  |
