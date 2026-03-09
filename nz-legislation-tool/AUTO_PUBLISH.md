# Auto-Publish Setup Complete! ✅

## Configuration Status

| Component | Status | Details |
|-----------|--------|---------|
| **GitHub Repository** | ✅ Live | https://github.com/edithatogo/nz-legislation |
| **NPM Token Secret** | ✅ Added | `NPM_TOKEN` configured |
| **CI/CD Workflow** | ✅ Updated | Auto-publish on version tags |
| **GitHub Release v1.0.0** | ✅ Live | https://github.com/edithatogo/nz-legislation/releases/tag/v1.0.0 |

---

## How Auto-Publish Works

### **Trigger:**
When you create a GitHub release with a **version tag** (e.g., `v1.0.0`, `v1.1.0`, `v2.0.0`), GitHub Actions will automatically:

1. ✅ Run all tests (unit, integration, E2E, property, hypothesis)
2. ✅ Run mutation testing
3. ✅ Build the project
4. ✅ Publish to npm
5. ✅ Create/update GitHub release

### **No Manual npm Commands Needed!**

---

## How to Publish a New Version

### **Option 1: Via GitHub Web Interface** (Recommended)

1. **Go to Releases:**
   https://github.com/edithatogo/nz-legislation/releases/new

2. **Create a new tag:**
   - Click "Choose a tag"
   - Enter: `v1.0.1` (or `v1.1.0`, `v2.0.0`, etc.)
   - Click "Create new tag"

3. **Fill in release details:**
   - **Release title:** `v1.0.1 - Bug Fixes` (or your description)
   - **Description:** What changed in this version

4. **Click "Publish release"**

5. **Watch it publish:**
   - Go to: https://github.com/edithatogo/nz-legislation/actions
   - You'll see the workflow running
   - When complete, package is live on npm!

### **Option 2: Via GitHub CLI**

```bash
# Create and push tag
git tag v1.0.1
git push origin v1.0.1

# Create release (this triggers publish)
gh release create v1.0.1 --title "v1.0.1 - Bug Fixes" --generate-notes
```

### **Option 3: Via Git Commands**

```bash
# Update version in package.json
npm version patch  # or minor, or major

# This automatically creates a tag
git push origin main --follow-tags

# Then create release
gh release create $(git describe --tags) --generate-notes
```

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

| Type | Command | Example | When to Use |
|------|---------|---------|-------------|
| **Patch** | `npm version patch` | 1.0.0 → 1.0.1 | Bug fixes only |
| **Minor** | `npm version minor` | 1.0.0 → 1.1.0 | New features (backward compatible) |
| **Major** | `npm version major` | 1.0.0 → 2.0.0 | Breaking changes |

---

## Monitoring Auto-Publish

### **Check Workflow Status:**
https://github.com/edithatogo/nz-legislation/actions

### **What You'll See:**

1. **Workflow starts** (blue circle)
2. **Tests run** (yellow spinner)
3. **Build completes** (green checkmark)
4. **npm publish** (green checkmark)
5. **Release created** (green checkmark)

### **If Workflow Fails:**

1. Click on the failed workflow
2. Click on the failed job
3. Read the error log
4. Fix the issue
5. Create a new tag (e.g., `v1.0.2`)
6. Try again

---

## Verify Publication

### **Check npm:**
https://www.npmjs.com/package/nz-legislation

### **Check GitHub Release:**
https://github.com/edithatogo/nz-legislation/releases

### **Test Installation:**
```bash
npm install -g nz-legislation
nzlegislation --version
```

---

## Troubleshooting

### **Workflow Doesn't Start**

**Check:**
- Tag starts with `v` (e.g., `v1.0.0` not `1.0.0`)
- Tag was pushed to GitHub
- Workflow file is valid

**Fix:**
```bash
# Delete and recreate tag
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
git tag v1.0.1
git push origin v1.0.1
```

### **npm Publish Fails**

**Common causes:**
- NPM_TOKEN secret not set or expired
- Package name already taken
- Version already published

**Fix:**
1. Check secret: https://github.com/edithatogo/nz-legislation/settings/secrets/actions
2. Verify npm token is valid: https://www.npmjs.com/settings/edithatogo/tokens
3. Increment version number
4. Create new tag

### **Tests Fail**

**Fix:**
1. Fix the failing tests
2. Commit changes
3. Create new version tag
4. Workflow will run again

---

## Current Workflow Configuration

```yaml
# Trigger: Version tags (v*)
if: startsWith(github.ref, 'refs/tags/v')

# Steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Build project (npm run build)
5. Publish to npm (npm publish --access public)
   - Uses: NODE_AUTH_TOKEN secret
6. Create GitHub Release
```

---

## Next Release Checklist

For your next release:

- [ ] Update version in `package.json` (or use `npm version`)
- [ ] Update CHANGELOG.md (if you have one)
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Create version tag (e.g., `v1.0.1`)
- [ ] Create GitHub release
- [ ] Monitor workflow: https://github.com/edithatogo/nz-legislation/actions
- [ ] Verify on npm: https://www.npmjs.com/package/nz-legislation
- [ ] Test installation: `npm install -g nz-legislation`

---

## Quick Reference

### **Create Patch Release (Bug Fixes)**
```bash
git commit -am "fix: Fix bug in search command"
npm version patch
git push origin main --follow-tags
gh release create $(git describe --tags) --generate-notes
```

### **Create Minor Release (New Features)**
```bash
git commit -am "feat: Add new export format"
npm version minor
git push origin main --follow-tags
gh release create $(git describe --tags) --generate-notes
```

### **Create Major Release (Breaking Changes)**
```bash
git commit -am "feat!: Change default output format"
npm version major
git push origin main --follow-tags
gh release create $(git describe --tags) --generate-notes
```

---

## What's Automated Now

✅ **Tests run** on every push  
✅ **Build created** on every push  
✅ **npm publish** on version tags  
✅ **GitHub release** on version tags  
✅ **Coverage reports** uploaded  
✅ **Mutation testing** run  

**You just create the tag - GitHub does the rest!** 🎉

---

## Links

| Resource | URL |
|----------|-----|
| **Repository** | https://github.com/edithatogo/nz-legislation |
| **Releases** | https://github.com/edithatogo/nz-legislation/releases |
| **Actions** | https://github.com/edithatogo/nz-legislation/actions |
| **npm Package** | https://www.npmjs.com/package/nz-legislation |
| **NPM Tokens** | https://www.npmjs.com/settings/edithatogo/tokens |
| **GitHub Secrets** | https://github.com/edithatogo/nz-legislation/settings/secrets/actions |

---

**Auto-publish is now configured! Create your next version tag and watch it publish automatically.** 🚀
