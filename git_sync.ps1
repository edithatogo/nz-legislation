# Git Sync Script
Set-Location $PSScriptRoot

# Fetch from remote
git fetch origin 2>&1 | Out-File -FilePath git_output.txt -Encoding utf8

# Add status
Write-Output "`n=== STATUS ===" | Out-File -FilePath git_output.txt -Append -Encoding utf8
git status --short 2>&1 | Out-File -FilePath git_output.txt -Append -Encoding utf8

# Add recent commits
Write-Output "`n=== RECENT COMMITS ===" | Out-File -FilePath git_output.txt -Append -Encoding utf8
git log --oneline -5 2>&1 | Out-File -FilePath git_output.txt -Append -Encoding utf8

# Add branches
Write-Output "`n=== BRANCHES ===" | Out-File -FilePath git_output.txt -Append -Encoding utf8
git branch -a 2>&1 | Out-File -FilePath git_output.txt -Append -Encoding utf8

# Check remote tracking
Write-Output "`n=== REMOTE TRACKING ===" | Out-File -FilePath git_output.txt -Append -Encoding utf8
git rev-parse --abbrev-ref @{u} 2>&1 | Out-File -FilePath git_output.txt -Append -Encoding utf8

Write-Output "Git info written to git_output.txt"
