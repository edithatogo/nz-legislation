# IDE Snippet Verification

Status: blocked/not applicable until an extension archive exists.

## VS Code / Open VSX

Future local install evidence must package and inspect the exact VSIX before any
marketplace upload:

```text
vsce package
code --install-extension <reviewed-vsix>
```

Open VSX is a separate path and requires its own reviewed archive and publisher
token:

```text
ovsx publish <reviewed-vsix>
```

Required evidence: clean-host installation, command invocation, SecretStorage
negative test, provider capability/source-card rendering, archive inspection,
SBOM, provenance, and marketplace-specific listing review. No extension archive
or publication is currently claimed.
