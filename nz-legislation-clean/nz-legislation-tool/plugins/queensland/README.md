# @nz-legislation/queensland

Queensland legislation plugin for the NZ Legislation Tool.

## Installation

```bash
nzlegislation plugin install @nz-legislation/queensland
```

## Usage

Once installed, the plugin automatically provides access to Queensland legislation:

```bash
# Search Queensland legislation
nzlegislation search --query "health" --jurisdiction au-qld

# Get specific act
nzlegislation get "act/1986/132" --jurisdiction au-qld

# List available jurisdictions
nzlegislation plugin status
```

## Features

- ✅ Search Queensland legislation
- ✅ Retrieve act details
- ✅ Get version history
- ✅ Generate citations (Australian style)
- ✅ Health monitoring
- ✅ Automatic caching
- ✅ Rate limiting

## Data Source

- **Website:** https://www.legislation.qld.gov.au
- **Jurisdiction:** Queensland, Australia
- **Coverage:** Acts, Regulations, Bills

## Citation Format

This plugin supports the Australian citation style:
```
{Title} ({Year}) Queensland
```

## Rate Limits

- 30 requests per minute
- Automatic rate limiting enforced
- Caching reduces API calls

## Support

- Issues: https://github.com/edithatogo/nz-legislation/issues
- Documentation: https://github.com/edithatogo/nz-legislation/docs

## License

Apache-2.0
