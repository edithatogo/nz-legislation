# Common Issues

This guide helps you diagnose and resolve frequently encountered issues with the NZ Legislation Tool.

## Installation Issues

### Node.js Version Error

**Problem:** `Error: Unsupported Node.js version`

**Solution:** Upgrade to Node.js 18.0 or later:
```bash
# Check version
node --version

# Upgrade using nvm (Linux/Mac)
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

### Dependency Installation Fails

**Problem:** `npm install` fails with errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## API Connection Issues

### API Key Not Working

**Problem:** `Error: Invalid API key`

**Solution:**
1. Verify API key is set correctly:
   ```bash
   npm run dev -- config --show
   ```
2. Re-set the API key:
   ```bash
   npm run dev -- config --key YOUR_API_KEY
   ```
3. Check environment variable:
   ```bash
   # Linux/Mac
   echo $NZ_LEGISLATION_API_KEY
   
   # Windows
   echo %NZ_LEGISLATION_API_KEY%
   ```

### API Timeout

**Problem:** `Error: Request timeout`

**Solution:**
1. Check internet connection
2. Increase timeout in config:
   ```bash
   npm run dev -- config --timeout 60000
   ```
3. Verify API status at https://api.legislation.govt.nz

## Search Issues

### No Results Returned

**Problem:** Search returns no results

**Solution:**
1. Try broader search terms
2. Check spelling
3. Use fewer keywords
4. Verify API connection

### Slow Search Performance

**Problem:** Search takes >5 seconds

**Solution:**
1. Use more specific queries
2. Reduce limit parameter
3. Check network connection
4. Enable caching (if available)

## Export Issues

### CSV Export Fails

**Problem:** `Error: Failed to export CSV`

**Solution:**
1. Check file permissions in output directory
2. Verify output path is writable
3. Try a different output format (JSON)
4. Reduce export size with limit parameter

### Large Export Timeout

**Problem:** Export fails for large datasets

**Solution:**
1. Use streaming export (if available)
2. Break into smaller batches
3. Increase timeout setting
4. Use pagination

## Citation Issues

### Invalid Citation Format

**Problem:** Citation format is incorrect

**Solution:**
1. Verify citation style is supported:
   - `nzmj` - New Zealand Medical Journal
   - `apa` - APA Style
   - `mla` - MLA Style
2. Check section reference is valid
3. Use `cite` command with `--help` for options

## Build Issues (Documentation)

### Docusaurus Build Fails

**Problem:** `npm run build` fails

**Solution:**
```bash
# Clear cache
npm run clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Broken Links in Documentation

**Problem:** Build warns about broken links

**Solution:**
1. Check link paths are relative to `docs/` folder
2. Use `.md` extension in links
3. Run link checker:
   ```bash
   npm run build -- --fail-on-errors
   ```

## Getting Help

If your issue isn't listed here:

1. Check the [FAQ](./faq.md)
2. Search [GitHub Issues](https://github.com/edithatogo/nz-legislation/issues)
3. Create a new issue with detailed information
4. Contact maintainers via GitHub Discussions

---

**Related:**
- [Error Reference](./error-reference.md)
- [FAQ](./faq.md)
- [Developer Guide](../developer-guide/index.md)
