# Legislation identity migration

The neutral display identity is **legislation**. This is an additive identity
layer, not a package or repository rename.

Stable compatibility remains `nz-legislation-tool`, `nzlegislation`, and
`nzlegislation-mcp`. `anzlegislation` and `anzlegislation-mcp` remain
transition aliases. The additive `legislation` and `legislation-mcp` binaries
already point to the same built entry points and are covered by parity tests.

The identifier matrix and collision audit are recorded in
[`legislation-identifier-matrix.json`](./legislation-identifier-matrix.json).
Unverified registry, marketplace, domain, and namespace availability is
explicitly not treated as ownership or publication evidence.

Any future removal or breaking rename requires an approved support window,
warning/deprecation policy, rollback plan, security review, and release gates.
