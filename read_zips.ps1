# List zip contents and write to WORKSPACE folder
$archiveDir = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
# Write to project root where we can read it
$outputFile = "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\ZIP_CONTENTS_REPORT.txt"

$zips = @(
    "nz_legislation_conductor_project.zip",
    "nz_legislation_publication_pipeline.zip",
    "nz_legislation_workflow_pack.zip"
)

$output = "=== ZIP ARCHIVE CONTENTS ===`n`n"

foreach ($zipName in $zips) {
    $zipPath = "$archiveDir\$zipName"
    $output += "`n" + ("="*60) + "`n"
    $output += "FILE: $zipName`n"
    $output += ("="*60) + "`n"
    
    if (Test-Path $zipPath) {
        try {
            $shell = New-Object -ComObject Shell.Application
            $zip = $shell.NameSpace($zipPath)
            $files = @()
            foreach ($item in $zip.Items()) {
                $files += $item.Path
            }
            $output += "Total items: $($files.Count)`n`n"
            foreach ($f in $files) {
                $output += "  $f`n"
            }
        } catch {
            $output += "Error: $_`n"
        }
    } else {
        $output += "NOT FOUND: $zipPath`n"
    }
}

$output | Out-File -FilePath $outputFile -Encoding utf8
Write-Host "Report written to: $outputFile"
