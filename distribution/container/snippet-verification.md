# Container Snippet Verification

Status: blocked/not applicable until an immutable image exists.

The intended future command is:

```text
docker run --rm --read-only --user 65532:65532 -e NZ_LEGISLATION_API_KEY ghcr.io/edithatogo/nz-legislation-tool:<immutable-digest> nzlegislation --help
```

Required evidence before publication: image digest, host Docker version, SBOM,
provenance attestation, vulnerability scan, non-root smoke test, and a negative
credential-leak test. This snippet makes no claim that an image is currently
published.
