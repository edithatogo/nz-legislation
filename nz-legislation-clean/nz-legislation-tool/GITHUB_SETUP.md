# GitHub Repository Setup Guide

## Repository Name
**`nz-legislation`**

## GitHub URL
**https://github.com/edithatogo/nz-legislation**

---

## Setup Instructions

### Option 1: Create via GitHub Web Interface (Recommended for network issues)

1. **Go to GitHub:** https://github.com/new

2. **Fill in repository details:**
   - **Repository name:** `nz-legislation`
   - **Description:** "CLI tool for searching and retrieving New Zealand legislation data"
   - **Visibility:** Public (recommended for open source)
   - **Initialize with:** 
     - ✅ Add a README file (optional, we already have one)
     - ❌ Add .gitignore (we already have one)
     - ❌ Choose a license (we already have LICENSE)

3. **Click "Create repository"**

4. **Push existing code:**
   ```bash
   cd nz-legislation-tool
   
   # Initialize git (if not already done)
   git init
   
   # Add your GitHub repository as remote
   git remote add origin https://github.com/edithatogo/nz-legislation.git
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "feat: Initial release - comprehensive testing complete"
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

---

### Option 2: Create via GitHub CLI (If network allows)

```bash
cd nz-legislation-tool

# Create repository
gh repo create nz-legislation --public --description "CLI tool for searching and retrieving New Zealand legislation data" --source=. --remote=origin --push
```

**If this fails due to network issues, use Option 1 (web interface).**

---

### Option 3: Create via Git Commands Only

```bash
cd nz-legislation-tool

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: Initial release - comprehensive testing complete"

# Add remote (replace with your repository URL after creating it on GitHub)
git remote add origin https://github.com/edithatogo/nz-legislation.git

# Rename branch to main
git branch -M main

# Push to GitHub (after creating repository on GitHub)
git push -u origin main
```

---

## After Creating Repository

### 1. Update README Badges (Optional)

Once the repository is created, you can add badges to the README:

```markdown
[![GitHub stars](https://img.shields.io/github/stars/edithatogo/nz-legislation?style=flat)](https://github.com/edithatogo/nz-legislation/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/edithatogo/nz-legislation)](https://github.com/edithatogo/nz-legislation/issues)
[![GitHub license](https://img.shields.io/github/license/edithatogo/nz-legislation)](https://github.com/edithatogo/nz-legislation/blob/main/LICENSE)
```

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. Click **"I understand my workflows, go ahead and enable them"**
4. CI/CD will run automatically on every push

### 3. Configure Repository Settings

1. Go to **Settings** → **General**
2. Under **"Danger Zone"**:
   - Ensure **"Allow merge commits"** is enabled
   - Consider enabling **"Squash merging"** for cleaner history
3. Under **"Features"**:
   - ✅ Enable **Issues**
   - ✅ Enable **Projects** (optional)
   - ✅ Enable **Wiki** (optional)
   - ✅ Enable **Discussions** (recommended for community)

---

## npm Publishing (After GitHub Setup)

### 1. Create npm Account (if you don't have one)

```bash
npm adduser
```

Or visit: https://www.npmjs.com/signup

### 2. Publish to npm

```bash
cd nz-legislation-tool

# Login to npm (if not already logged in)
npm login

# Publish (make sure version is 1.0.0 in package.json)
npm publish --access public
```

### 3. Verify Publication

Visit: https://www.npmjs.com/package/nz-legislation

---

## Troubleshooting

### Network Issues with GitHub

If you can't access GitHub due to network restrictions:

1. **Use HTTPS instead of SSH:**
   ```bash
   git remote add origin https://github.com/edithatogo/nz-legislation.git
   ```

2. **Try GitHub via mobile hotspot** (if institutional network blocks GitHub)

3. **Use GitHub Desktop app** (sometimes works when CLI doesn't)

4. **Create repository via web interface** and push later when network allows

### Git Push Fails

If `git push` fails:

```bash
# Check remote URL
git remote -v

# Should show:
# origin  https://github.com/edithatogo/nz-legislation.git (fetch)
# origin  https://github.com/edithatogo/nz-legislation.git (push)

# If incorrect, update it:
git remote set-url origin https://github.com/edithatogo/nz-legislation.git
```

### Authentication Issues

If prompted for credentials:

1. **Use GitHub Personal Access Token** instead of password
2. Create token at: https://github.com/settings/tokens
3. Use token as password when prompted

---

## Repository Checklist

Before publishing, ensure:

- [ ] Repository created on GitHub
- [ ] All files pushed to GitHub
- [ ] README displays correctly
- [ ] GitHub Actions enabled
- [ ] npm account created
- [ ] Package published to npm
- [ ] GitHub URL in README matches: `https://github.com/edithatogo/nz-legislation`

---

## Quick Reference

| Item | Value |
|------|-------|
| **GitHub Username** | edithatogo |
| **Repository Name** | nz-legislation |
| **Full GitHub URL** | https://github.com/edithatogo/nz-legislation |
| **npm Package Name** | nz-legislation |
| **CLI Command** | `nzlegislation` |
| **Install Command** | `npm install -g nz-legislation` |
| **npx Command** | `npx nz-legislation` |

---

**Good luck with your repository setup!** 🚀
