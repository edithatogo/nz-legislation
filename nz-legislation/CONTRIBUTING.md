# Contributing to NZ Legislation CLI

Thank you for your interest in contributing! This guide helps you get started.

---

## 🚀 Quick Start

### 1. Install Rust

```bash
# Windows (PowerShell)
winget install Rustlang.Rustup

# macOS (Homebrew)
brew install rustup

# Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Fork and Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/nz-legislation
cd nz-legislation
git remote add upstream https://github.com/edithatogo/nz-legislation
```

### 3. Set Up Development Environment

```bash
# Install rustfmt and clippy (usually pre-installed)
rustup component add rustfmt clippy

# Build the project
cargo build

# Run tests
cargo test
```

---

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-123
```

### 2. Make Changes

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

### 3. Run Tests and Lint

```bash
# Run all tests
cargo test

# Format code
cargo fmt

# Lint
cargo clippy -- -D warnings
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature

- Description of change
- Related issues: #123"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
# Then create PR on GitHub
```

---

## 🧪 Testing Guidelines

### Writing Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_example() {
        assert_eq!(2 + 2, 4);
    }

    #[tokio::test]
    async fn test_async_function() {
        let result = some_async_function().await;
        assert!(result.is_ok());
    }
}
```

### Test Categories

- **Unit tests:** Test individual functions/modules
- **Integration tests:** Test API interactions (use `wiremock`)
- **CLI tests:** Test command-line interface (use `assert_cmd`)

### Running Tests

```bash
# All tests
cargo test

# Specific test
cargo test test_name

# With output
cargo test -- --nocapture

# Coverage (requires cargo-tarpaulin)
cargo tarpaulin --out html
```

---

## 📝 Code Style

### Rust Style

- Follow Rust API Guidelines
- Use `cargo fmt` (rustfmt)
- Use `cargo clippy` for linting
- Document public APIs with rustdoc

### Example

```rust
/// Documentation for public functions.
///
/// # Arguments
///
/// * `param` - Description of parameter
///
/// # Returns
///
/// Description of return value
///
/// # Example
///
/// ```
/// let result = function_name(param);
/// ```
pub fn function_name(param: Type) -> Result<ReturnType, Error> {
    // Implementation
}
```

### Error Handling

- Use `thiserror` for custom error types
- Use `anyhow::Result` for application-level errors
- Provide clear error messages
- Make errors retryable when appropriate

---

## 📚 Documentation

### Writing Documentation

- Document all public APIs
- Include examples in doc comments
- Update README for user-facing changes
- Add inline comments for complex logic

### Building Docs

```bash
# Generate documentation
cargo doc --open

# Build without opening browser
cargo doc
```

---

## 🎯 Good First Issues

Look for issues labeled:
- [`good first issue`](https://github.com/edithatogo/nz-legislation/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [`help wanted`](https://github.com/edithatogo/nz-legislation/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

### Example First Contributions

1. Add documentation examples
2. Write tests for existing code
3. Fix typos in documentation
4. Improve error messages
5. Add CLI help text improvements

---

## 🔧 Common Tasks

### Update Dependencies

```bash
cargo update
```

### Check for Security Issues

```bash
cargo audit
```

### Build Release

```bash
cargo build --release
```

### Cross-Platform Build

```bash
# Install cross
cargo install cross

# Build for different targets
cross build --target x86_64-pc-windows-gnu
cross build --target x86_64-apple-darwin
```

---

## 🤔 Getting Help

- **GitHub Discussions:** Ask questions, share ideas
- **GitHub Issues:** Report bugs, request features
- **Email:** dylan.mordaunt@vuw.ac.nz

---

## 📄 Code of Conduct

Be respectful and inclusive. We welcome contributors from all backgrounds.

---

## 🎓 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for co-authorship on academic publications (for significant contributions)

---

Thank you for contributing! 🙏
