import zipfile
import os

archive_dir = r"C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
output_file = os.path.join(archive_dir, "ZIP_CONTENTS.txt")

zips = [
    "nz_legislation_conductor_project.zip",
    "nz_legislation_publication_pipeline.zip",
    "nz_legislation_workflow_pack.zip"
]

with open(output_file, 'w', encoding='utf-8') as out:
    out.write("=== ZIP ARCHIVE CONTENTS ===\n\n")
    
    for zip_name in zips:
        zip_path = os.path.join(archive_dir, zip_name)
        out.write(f"\n{'='*60}\n")
        out.write(f"FILE: {zip_name}\n")
        out.write(f"{'='*60}\n")
        
        if os.path.exists(zip_path):
            try:
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    files = zf.namelist()
                    out.write(f"Total files: {len(files)}\n\n")
                    for f in files:
                        out.write(f"  {f}\n")
            except Exception as e:
                out.write(f"Error reading zip: {e}\n")
        else:
            out.write(f"NOT FOUND: {zip_path}\n")

print(f"Report written to: {output_file}")
