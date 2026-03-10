#!/bin/bash
# Release v1.1.0 Script
# Run this to publish the Performance & Scalability release

set -e

echo "🚀 Publishing Release v1.1.0..."

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Staging changes..."
git add .

echo "💾 Committing release..."
git commit -m "chore: Release v1.1.0 - Performance and Scalability"

echo "📝 Versioning with Changesets..."
npx changeset version

echo "📦 Publishing to npm..."
npx changeset publish

echo "🏷️ Creating git tags..."
git push --follow-tags

echo "✅ Release v1.1.0 published successfully!"
echo ""
echo "Next steps:"
echo "1. Verify release on npm: https://www.npmjs.com/package/nz-legislation-tool"
echo "2. Create GitHub release from the new tag"
echo "3. Announce release to users"
