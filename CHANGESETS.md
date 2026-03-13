# Changesets - Version Management & Changelog

This project uses [Changesets](https://github.com/changesets/changesets) for automated versioning and changelog generation.

## 🎯 What is Changesets?

Changesets is a tool that manages versioning and changelogs by tracking changes in a `changeset` file alongside your code. When you're ready to release, Changesets automatically:

- Bumps version numbers based on the type of changes
- Generates changelog entries
- Creates GitHub releases
- Publishes to npm

## 📝 How to Create a Changeset

When you make a change that should be released, create a changeset:

```bash
pnpm changeset
```

This will prompt you with questions:

1. **Which packages would you like to include?**
   - Select the packages that have changes (use space to select)

2. **Which packages should have a major bump?**
   - Press enter for none (unless you're making breaking changes)

3. **Which packages should have a minor bump?**
   - Select for new features (backward compatible)

4. **Which packages should have a patch bump?**
   - Select for bug fixes (backward compatible)

5. **Add a summary message**
   - Write a brief description of what changed
   - Example: "Fix rate limiting configuration" or "Add new export format"

This creates a file in `.changeset/` that should be committed with your PR.

## 📋 Changeset Types

| Type      | When to Use                        | Example                         |
| --------- | ---------------------------------- | ------------------------------- |
| **Major** | Breaking changes                   | `pnpm changeset` → select major |
| **Minor** | New features (backward compatible) | `pnpm changeset` → select minor |
| **Patch** | Bug fixes (backward compatible)    | `pnpm changeset` → select patch |

## 🚀 Release Process

### Automatic Release (Recommended)

1. **Create changesets** in your feature branch
2. **Merge to main** - Changesets action will:
   - Create a "Version Packages" PR automatically
   - When merged, it will publish to npm and create GitHub release

### Manual Release

```bash
# Bump versions and update changelog
pnpm changeset:version

# Publish to npm
pnpm changeset:publish
```

## 📖 Example Workflow

```bash
# 1. Make your code changes
git checkout -b feature/new-command

# 2. Create a changeset
pnpm changeset
# Follow prompts to select version bump type and add message

# 3. Commit everything
git add .
git commit -m "feat: add new export command

Added CSV export functionality for search results

Co-Authored-By: Changeset Bot"

# 4. Push and create PR
git push origin feature/new-command
# Create PR on GitHub

# 5. After PR is merged to main:
# - Changesets action runs automatically
# - Creates "Version Packages" PR
# - When that PR is merged, release is published
```

## 🔧 Configuration

Configuration is in `.changeset/config.json`:

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "edithatogo/nz-legislation" }],
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

## 📦 Snapshot Releases (Pre-releases)

For testing releases before publishing:

```bash
# Create a snapshot release
pnpm changeset version --snapshot alpha
pnpm changeset publish --tag alpha
```

This publishes a version like `1.0.1-alpha.0` that won't affect the main release.

## 🎯 Best Practices

- ✅ **Create a changeset for every user-facing change**
- ✅ **Commit changesets with the code they describe**
- ✅ **Use clear, descriptive messages**
- ✅ **Select the correct version bump type**
- ❌ **Don't create changesets for internal refactors, tests, or docs**

## 🛠️ Troubleshooting

### Forgot to create a changeset?

```bash
# Create it now and amend your commit
pnpm changeset
git add .changeset
git commit --amend --no-edit
```

### Changeset with wrong version?

```bash
# Edit the .changeset file directly
# Change "minor" to "patch" or vice versa
```

### Need to skip a release?

```bash
# Add an empty changeset
echo '---
"nz-legislation-tool": patch
---

No release needed
' > .changeset/no-release.md
```

## 📚 Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Changesets Action](https://github.com/changesets/action)
- [Semantic Versioning](https://semver.org/)

---

**Last Updated:** 2026-03-10
**Maintainer:** @edithatogo
