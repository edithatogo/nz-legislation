@echo off
REM Run PowerShell script to read zip contents
powershell -ExecutionPolicy Bypass -File "%~dp0read_zips.ps1"
echo Done! Check ZIP_CONTENTS_REPORT.txt
pause
