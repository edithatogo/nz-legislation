Set-Location "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"

# List zip files
Write-Host "=== Zip Files Found ==="
Get-ChildItem *.zip | ForEach-Object { Write-Host $_.Name }

# Create temp and copy
$tempDir = "C:\temp\archives"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
Write-Host "`n=== Copying to $tempDir ==="

Copy-Item *.zip -Destination $tempDir
Write-Host "Copied!"

# Extract
$extractDir = "C:\temp\extracted"
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null
Write-Host "`n=== Extracting to $extractDir ==="

Get-ChildItem "$tempDir\*.zip" | ForEach-Object {
    Write-Host "Extracting $($_.Name)..."
    Expand-Archive -Path $_.FullName -DestinationPath $extractDir -Force
}

Write-Host "`n=== Extraction Complete ==="
Write-Host "Contents:"
Get-ChildItem -Path $extractDir -Recurse -File | Select-Object FullName
