# Deployment Guide

This guide covers deploying the NZ Legislation Tool documentation site.

## Quick Start

### Prerequisites

- Node.js 18.0+
- npm or pnpm
- GitHub account with push access to repository

## Local Development

```bash
cd nz-legislation-tool/documentation-site

# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The documentation site is configured for automatic deployment via GitHub Actions.

**Workflow:** `.github/workflows/docs.yml`

**Triggers:**
- Push to `main` branch (changes to `documentation-site/` or `docs/`)
- Manual trigger via GitHub Actions UI

**Deployment URL:** https://edithatogo.github.io/nz-legislation/

### Manual Deployment

```bash
cd nz-legislation-tool/documentation-site

# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Algolia DocSearch (apply at https://docsearch.algolia.com/)
ALGOLIA_APP_ID=your_app_id_here
ALGOLIA_API_KEY=your_search_api_key_here

# Google Analytics (create at https://analytics.google.com/)
GA_TRACKING_ID=G-XXXXXXXXXX
```

### Docusaurus Configuration

Key settings in `docusaurus.config.ts`:

```typescript
{
  url: 'https://edithatogo.github.io',
  baseUrl: '/nz-legislation/',
  organizationName: 'edithatogo',
  projectName: 'nz-legislation',
  deploymentBranch: 'gh-pages',
}
```

## Versioning

### Creating a New Version

```bash
cd nz-legislation-tool/documentation-site

# Create new version (e.g., 1.1.0)
npm run docusaurus docs:version 1.1.0
```

This will:
- Copy current docs to `versioned_docs/version-1.1.0/`
- Create `versioned_sidebars/version-1.1.0-sidebars.ts`
- Update `versions.json`

### Version Structure

```
documentation-site/
├── docs/                    # Current (development) docs
├── versioned_docs/
│   └── version-1.0/        # v1.0 stable docs
├── versions.json            # List of versions
└── sidebars.ts              # Current sidebar
```

## Monitoring

### Build Status

Check GitHub Actions: https://github.com/edithatogo/nz-legislation/actions

### Analytics

- **Google Analytics:** https://analytics.google.com/
- **Search Analytics:** https://docsearch.algolia.com/ (after approval)

### Uptime Monitoring

Recommended services:
- **UptimeRobot:** https://uptimerobot.com/ (free tier available)
- **Pingdom:** https://www.pingdom.com/

## Troubleshooting

### Build Fails

```bash
# Clear cache
npm run clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Deployment Fails

1. Check GitHub Actions logs
2. Verify GitHub Pages is enabled in repository settings
3. Ensure `GITHUB_TOKEN` secret is available (auto-created by GitHub)

### Broken Links

```bash
# Build with strict link checking
npm run build -- --fail-on-errors

# Find broken links
grep -r "http" docs/ | grep -v "github.com"
```

## Post-Deployment Checklist

After deploying:

- [ ] Verify site loads at production URL
- [ ] Test all navigation links
- [ ] Test search functionality (if configured)
- [ ] Test version switching (if multiple versions)
- [ ] Check analytics tracking is working
- [ ] Verify mobile responsiveness

## Maintenance

### Regular Updates

```bash
# Update Docusaurus
npm update @docusaurus/core @docusaurus/preset-classic

# Update dependencies
npm update

# Check for security updates
npm audit fix
```

### Content Updates

1. Edit markdown files in `docs/`
2. Test locally: `npm run start`
3. Commit and push to `main`
4. GitHub Actions auto-deploys

## Support

- **Issues:** https://github.com/edithatogo/nz-legislation/issues
- **Discussions:** https://github.com/edithatogo/nz-legislation/discussions

---

**Related:**
- [Contributing](./developer-guide/contributing.md)
- [Testing](./developer-guide/testing.md)
- [Troubleshooting](./troubleshooting/common-issues.md)
