@echo off
cd /d "%~dp0"
(
echo === GIT REMOTE ===
git remote -v
echo.
echo === FETCH ===
git fetch origin
echo.
echo === STATUS ===
git status --short
echo.
echo === LOG ===
git log --oneline -5
echo.
echo === BRANCHES ===
git branch -a
) > git_results.txt 2>&1
echo Done
