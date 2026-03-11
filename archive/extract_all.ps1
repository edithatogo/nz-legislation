# Extract all three zip files to C:\temp

$sourceDir = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
$destBase = "C:\temp"

# Copy zips to temp
Write-Host "Copying zips to C:\temp..."
Copy-Item "$sourceDir\nz_legislation_conductor_project.zip" "$destBase\" -Force
Copy-Item "$sourceDir\nz_legislation_publication_pipeline.zip" "$destBase\" -Force
Copy-Item "$sourceDir\nz_legislation_workflow_pack.zip" "$destBase\" -Force
Write-Host "Done copying."

# Extract each
Write-Host "Extracting conductor project..."
Expand-Archive "$destBase\nz_legislation_conductor_project.zip" "$destBase\conductor" -Force

Write-Host "Extracting publication pipeline..."
Expand-Archive "$destBase\nz_legislation_publication_pipeline.zip" "$destBase\publication" -Force

Write-Host "Extracting workflow pack..."
Expand-Archive "$destBase\nz_legislation_workflow_pack.zip" "$destBase\workflow" -Force

Write-Host "Done extracting!"

# List contents
Write-Host "`n=== CONDUCTOR ==="
Get-ChildItem "$destBase\conductor" -Recurse -File | Select-Object FullName

Write-Host "`n=== PUBLICATION ==="
Get-ChildItem "$destBase\publication" -Recurse -File | Select-Object FullName

Write-Host "`n=== WORKFLOW ==="
Get-ChildItem "$destBase\workflow" -Recurse -File | Select-Object FullName
