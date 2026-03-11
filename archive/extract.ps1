$ErrorActionPreference = "Stop"

# Define paths
$archiveDir = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
$extractBase = "$archiveDir\extracted"

# Create extract directory
New-Item -ItemType Directory -Force -Path $extractBase | Out-Null

# Extract all three zips
$zips = @(
    "nz_legislation_conductor_project.zip",
    "nz_legislation_publication_pipeline.zip",
    "nz_legislation_workflow_pack.zip"
)

foreach ($zipName in $zips) {
    $zipPath = Join-Path $archiveDir $zipName
    $extractName = $zipName -replace '\.zip$', ''
    $extractPath = Join-Path $extractBase $extractName
    
    Write-Host "Extracting $zipName..."
    
    # Create destination folder
    New-Item -ItemType Directory -Force -Path $extractPath | Out-Null
    
    # Extract
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    
    Write-Host "  -> $extractPath"
}

Write-Host "`nExtraction complete!"
Write-Host "Contents:"
Get-ChildItem -Path $extractBase -Recurse -File | Select-Object FullName
