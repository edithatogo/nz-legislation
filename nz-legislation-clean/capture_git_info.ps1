Set-Location "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation"

# Run git commands and capture output
$fetch = git fetch origin 2>&1 | Out-String
$status = git status --short 2>&1 | Out-String
$log = git log --oneline -5 2>&1 | Out-String
$branch = git branch --show-current 2>&1 | Out-String
$branches = git branch -a 2>&1 | Out-String
$upstream = git rev-parse --abbrev-ref @{u} 2>&1 | Out-String

# Combine output
$output = @"
=== FETCH ===
$fetch

=== STATUS ===
$status

=== RECENT COMMITS ===
$log

=== CURRENT BRANCH ===
$branch

=== ALL BRANCHES ===
$branches

=== UPSTREAM ===
$upstream
"@

# Write to file with absolute path
$output | Out-File -FilePath "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\git_output.txt" -Encoding utf8 -Force

Write-Host "Output written successfully"
Get-ChildItem "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\git_output.txt" | Select-Object FullName, Length
