# Release v1.1.0 PowerShell Script

Write-Host "🚀 Publishing Release v1.1.0..." -ForegroundColor Green

$projectPath = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\nz-legislation-tool"
Set-Location $projectPath

Write-Host "`n📦 Staging changes..." -ForegroundColor Yellow
git add .

Write-Host "`n💾 Committing release..." -ForegroundColor Yellow
git commit -m "chore: Release v1.1.0 - Performance and Scalability"

Write-Host "`n📝 Versioning with Changesets..." -ForegroundColor Yellow
npx changeset version

Write-Host "`n📦 Publishing to npm..." -ForegroundColor Yellow
npx changeset publish

Write-Host "`n🏷️ Creating git tags..." -ForegroundColor Yellow
git push --follow-tags

Write-Host "`n✅ Release v1.1.0 published successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Verify on npm: https://www.npmjs.com/package/nz-legislation-tool"
Write-Host "2. Create GitHub release from the new tag"
Write-Host "3. Announce to users"
