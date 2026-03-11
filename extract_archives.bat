@echo off
REM Create temp directory
mkdir C:\temp\archives 2>nul

REM Copy zip files
copy "%~dp0archive\nz_legislation_*.zip" C:\temp\archives\ >nul

REM Extract using PowerShell
powershell -Command "Get-ChildItem 'C:\temp\archives\*.zip' | ForEach-Object { Expand-Archive -Path $_.FullName -DestinationPath 'C:\temp\extracted' -Force -ErrorAction SilentlyContinue }"

echo Extraction complete!
echo.
echo Contents of C:\temp\extracted:
dir /s C:\temp\extracted
