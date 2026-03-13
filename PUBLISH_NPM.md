# npm Publishing Guide

## Current Status

✅ **GitHub Repository:** https://github.com/edithatogo/nz-legislation  
✅ **GitHub Release v1.0.0:** https://github.com/edithatogo/nz-legislation/releases/tag/v1.0.0  
⏳ **npm Package:** Ready to publish

---

## Issue

npm command is not available in the current environment. You'll need to publish manually.

---

## Option 1: Publish via npm Website (Recommended)

### Step 1: Create npm Account

If you don't have an npm account:

1. Go to: https://www.npmjs.com/signup
2. Create account with username: `edithatogo`
3. Verify email

### Step 2: Login to npm

Open a terminal with Node.js installed:

```bash
npm login
```

Enter your npm credentials when prompted.

### Step 3: Navigate to Project

```bash
cd "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\nz-legislation-tool"
```

### Step 4: Verify Package Configuration

Check `package.json`:

```json
{
  "name": "nz-legislation",
  "version": "1.0.0",
  "bin": {
    "nzlegislation": "./dist/cli.js"
  }
}
```

✅ Name: `nz-legislation`  
✅ Version: `1.0.0`  
✅ Bin: `nzlegislation`

### Step 5: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 6: Publish to npm

```bash
npm publish --access public
```

**Expected Output:**

```
+ nz-legislation@1.0.0
```

### Step 7: Verify Publication

Visit: https://www.npmjs.com/package/nz-legislation

You should see your package live!

---

## Option 2: Install npm Properly

If you want to use npm commands in this environment:

### Windows (Scoop)

```bash
# Reinstall Node.js with npm
scoop uninstall nodejs-lts
scoop install nodejs-lts
```

### Verify Installation

```bash
node --version
npm --version
```

Then proceed with Option 1, Step 3.

---

## Option 3: Use GitHub Actions for Auto-Publish

Set up automatic npm publishing on release:

### 1. Add npm Token to GitHub Secrets

1. Go to: https://www.npmjs.com/settings/edithatogo/tokens
2. Create new token (Automation)
3. Copy token
4. Go to: https://github.com/edithatogo/nz-legislation/settings/secrets/actions
5. Add secret: `NPM_TOKEN` = [your token]

### 2. Update CI/CD Workflow

The workflow is already configured in `.github/workflows/ci.yml` to publish on release.

### 3. Create Release

When you create a GitHub release with version tag (e.g., `v1.0.0`), it will auto-publish to npm.

---

## Post-Publishing Steps

### 1. Update README Badges

After publishing, add npm badge to README:

```markdown
[![npm](https://img.shields.io/npm/v/nz-legislation)](https://www.npmjs.com/package/nz-legislation)
[![npm downloads](https://img.shields.io/npm/dm/nz-legislation)](https://www.npmjs.com/package/nz-legislation)
```

### 2. Test Installation

```bash
# Test installation
npm install -g nz-legislation

# Test command
nzlegislation --version

# Test search
nzlegislation search --query "health" --limit 5
```

### 3. Announce Release

Share on:

- Twitter/LinkedIn
- Research networks
- NZ Legislation API community
- Academic networks

---

## Troubleshooting

### "npm command not found"

**Solution:** Install Node.js from https://nodejs.org/

### "npm ERR! 403 Forbidden"

**Cause:** Package name already taken or not logged in

**Solution:**

```bash
npm login
# Or choose different package name
```

### "npm ERR! 400 Bad Request"

**Cause:** Invalid package.json

**Solution:** Verify package.json is valid JSON

### "npm ERR! 404 Not Found"

**Cause:** Not logged in or token expired

**Solution:**

```bash
npm login
```

---

## Package Details

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Package Name** | `nz-legislation`                 |
| **Version**      | `1.0.0`                          |
| **License**      | Apache-2.0                       |
| **Repository**   | github:edithatogo/nz-legislation |
| **Bin Command**  | `nzlegislation`                  |
| **Main Entry**   | `dist/cli.js`                    |
| **Node Engine**  | `>=18.0.0`                       |

---

## Quick Reference Commands

```bash
# Login to npm
npm login

# Publish package
npm publish --access public

# Unpublish (within 72 hours)
npm unpublish nz-legislation@1.0.0

# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# View package info
npm view nz-legislation
```

---

## Success Checklist

- [ ] npm account created
- [ ] Logged in to npm
- [ ] Package built (`npm run build`)
- [ ] Package published (`npm publish`)
- [ ] Verified on npmjs.com
- [ ] Tested installation (`npm install -g nz-legislation`)
- [ ] Updated README with npm badge
- [ ] Announced release

---

**Good luck with publishing!** 🚀

After publishing, your package will be available at:
https://www.npmjs.com/package/nz-legislation
