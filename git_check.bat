@echo off
cd /d %~dp0
echo === GIT REMOTE ===
git remote -v
echo.
echo === FETCH ===
git fetch origin
echo.
echo === STATUS ===
git status --short
echo.
echo === RECENT COMMITS ===
git log --oneline -5
echo.
echo === BRANCHES ===
git branch -a
echo.
echo === REMOTE SHOW ===
git remote show origin
echo.
echo === PR CHECK ===
gh pr list --state open 2>nul || echo GitHub CLI not available
pause
