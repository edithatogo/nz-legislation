# Pull Request Template

<!-- Thanks for contributing! Please follow the checklist below and ensure all items are completed before requesting review. -->

## 📋 Description

<!-- Provide a clear and concise description of what this PR does. -->

**Type of Change:**

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix
- [ ] 🧪 Test addition/update
- [ ] 🔧 Configuration change

## 🎯 Related Issues

<!-- Link any related issues using GitHub keywords (e.g., "Fixes #123", "Closes #456", "Related to #789") -->

Fixes #
Related to #

## 🚦 Release Intent

- [ ] `release-neutral`
- [ ] `patch`
- [ ] `minor`
- [ ] `major`
- [ ] `prerelease-only`

**Public surfaces affected:**

- [ ] CLI
- [ ] MCP
- [ ] Future HTTP/OpenAPI adapter
- [ ] Packaging or install behavior
- [ ] Documentation only

**Changeset status:**

- [ ] A changeset is included
- [ ] No changeset is needed and I explain why below

**If no changeset is included, explain why:**

<!-- release-neutral rationale -->

## ✅ Checklist

### Code Quality

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have run `pnpm lint` and `pnpm typecheck` locally
- [ ] I have run `pnpm format` to ensure consistent formatting

### Testing

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] All tests pass locally (`pnpm test:run`)
- [ ] I have updated test documentation if needed
- [ ] Test coverage has not decreased (or decrease is justified)

### Documentation

- [ ] I have updated the README.md if needed
- [ ] I have updated CHANGESETS.md if this affects versioning
- [ ] I have added a changeset for this PR (run `pnpm changeset`)

### Security

- [ ] My changes do not introduce security vulnerabilities
- [ ] I have not committed any secrets, API keys, or credentials
- [ ] I have followed secure coding practices

## 🧪 Testing Instructions

<!-- Provide step-by-step instructions for testing this PR. Include:
     - How to set up the environment
     - Commands to run
     - Expected behavior
     - Any specific test cases to verify
-->

### Setup

```bash
# Install dependencies
pnpm install

# Build if needed
pnpm build
```

### Test Steps

1.
2.
3.

### Expected Behavior

<!-- Describe what should happen when testing -->

## 📊 Screenshots/Recordings (if applicable)

<!-- For UI changes, add screenshots or screen recordings showing the before/after -->

## 🚀 Deployment Notes (if applicable)

<!-- Include any special deployment instructions, database migrations, or configuration changes required -->

## 📝 Additional Context

<!-- Add any other context about the PR here. This could include:
     - Background information
     - Design decisions
     - Trade-offs considered
     - Future improvements
-->

---

## 🔬 For Maintainers

### Review Checklist

- [ ] Code quality and style approved
- [ ] Tests are comprehensive and passing
- [ ] Documentation is updated
- [ ] Changeset is present and correct
- [ ] Security review completed (if needed)
- [ ] Performance impact assessed (if applicable)

### Pre-Merge Actions

- [ ] Squash commits if needed
- [ ] Ensure commit message follows conventional commits
- [ ] Add to milestone (if applicable)
- [ ] Add labels as needed

---

**By submitting this PR, I confirm that:**

- I have read and agree to the project's [Contributing Guidelines](CONTRIBUTING.md)
- My contributions are licensed under the project's [Apache 2.0 License](LICENSE)
- This PR does not contain any third-party code without proper attribution
