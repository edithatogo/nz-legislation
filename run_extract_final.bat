@echo off
cd /d "%~dp0"
echo Running Python extraction script...
python archive\extract_and_report.py
echo Done! Check archive\EXTRACTION_REPORT.md
pause
