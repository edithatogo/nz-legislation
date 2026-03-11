import zipfile
import os

# List zips and their contents
archive_dir = r"C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
zips = [
    "nz_legislation_conductor_project.zip",
    "nz_legislation_publication_pipeline.zip",
    "nz_legislation_workflow_pack.zip"
]

for zip_name in zips:
    zip_path = os.path.join(archive_dir, zip_name)
    if os.path.exists(zip_path):
        print(f"\n{'='*60}")
        print(f"ARCHIVE: {zip_name}")
        print(f"{'='*60}")
        try:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                files = zf.namelist()
                print(f"Total files: {len(files)}\n")
                for f in files[:50]:  # First 50 files
                    print(f"  {f}")
                if len(files) > 50:
                    print(f"  ... and {len(files) - 50} more files")
        except Exception as e:
            print(f"Error: {e}")
    else:
        print(f"NOT FOUND: {zip_path}")

print("\n\nDone!")
