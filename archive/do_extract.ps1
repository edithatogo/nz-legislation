$ErrorActionPreference = "Continue"

$sourceDir = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
$destDir = "C:\temp\project-conductor"

# Create destination
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

# Copy zips
Write-Host "Copying zips..."
Copy-Item "$sourceDir\nz_legislation_*.zip" -Destination "$destDir\zips" -Force

# Extract each
$zips = @(
    @{Source="nz_legislation_conductor_project.zip"; Dest="conductor_archive"},
    @{Source="nz_legislation_publication_pipeline.zip"; Dest="publication_archive"},
    @{Source="nz_legislation_workflow_pack.zip"; Dest="workflow_archive"}
)

foreach ($zip in $zips) {
    Write-Host "Extracting $($zip.Source)..."
    $zipPath = "$destDir\zips\$($zip.Source)"
    $extractPath = "$destDir\$($zip.Dest)"
    New-Item -ItemType Directory -Force -Path $extractPath | Out-Null
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    Write-Host "  -> $extractPath"
}

Write-Host "`nDone! Contents:"
Get-ChildItem -Path $destDir -Recurse -File | Select-Object FullName
