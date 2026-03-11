# Git Sync and Check Script
$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

$output = @()

$output += "=== GIT REMOTE ==="
$output += git remote -v 2>&1
$output += ""
$output += "=== FETCH ==="
$output += git fetch origin 2>&1
$output += ""
$output += "=== CURRENT BRANCH ==="
$output += git branch --show-current 2>&1
$output += ""
$output += "=== STATUS ==="
$output += git status --short 2>&1
$output += ""
$output += "=== RECENT COMMITS ==="
$output += git log --oneline -5 2>&1
$output += ""
$output += "=== BRANCHES ==="
$output += git branch -a 2>&1
$output += ""
$output += "=== REMOTE TRACKING ==="
$output += git rev-parse --abbrev-ref @{u} 2>&1
$output += ""
$output += "=== AHEAD/BEHIND ==="
$output += git status -sb 2>&1

# Write output
$output | Out-File -FilePath ".\git_results.txt" -Encoding utf8
Write-Host "Git results written to git_results.txt"

# Also check GitHub PRs via API
$headers = @{}
if ($env:GITHUB_TOKEN) {
    $headers["Authorization"] = "token $env:GITHUB_TOKEN"
}

try {
    $prs = Invoke-RestMethod -Uri "https://api.github.com/repos/edithatogo/nz-legislation/pulls?state=open" -Headers $headers -Method Get 2>&1
    $output_prs = @()
    $output_prs += "=== OPEN PULL REQUESTS ==="
    if ($prs.Count -gt 0) {
        foreach ($pr in $prs) {
            $output_prs += "PR #$($pr.number): $($pr.title) by $($pr.user.login)"
        }
    } else {
        $output_prs += "No open pull requests"
    }
    $output_prs | Out-File -FilePath ".\pr_results.txt" -Encoding utf8
    Write-Host "PR results written to pr_results.txt"
} catch {
    Write-Host "Could not fetch PRs: $_"
}
