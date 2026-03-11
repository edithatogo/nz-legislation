import zipfile
import os
import shutil

# Use raw strings for paths with spaces
archive_dir = r"C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
temp_dir = r"C:\temp\extracted"

# Create temp directory
os.makedirs(temp_dir, exist_ok=True)
print(f"Created {temp_dir}")

# List and extract zips
zips = [
    "nz_legislation_conductor_project.zip",
    "nz_legislation_publication_pipeline.zip", 
    "nz_legislation_workflow_pack.zip"
]

for zip_name in zips:
    zip_path = os.path.join(archive_dir, zip_name)
    if os.path.exists(zip_path):
        print(f"\nExtracting {zip_name}...")
        with zipfile.ZipFile(zip_path, 'r') as zf:
            # Extract to subfolder
            extract_name = zip_name.replace('.zip', '')
            extract_path = os.path.join(temp_dir, extract_name)
            os.makedirs(extract_path, exist_ok=True)
            zf.extractall(extract_path)
            print(f"  -> {extract_path}")
            # List first few files
            files = zf.namelist()[:5]
            print(f"     Files: {', '.join(files)}")
            if len(zf.namelist()) > 5:
                print(f"     ... and {len(zf.namelist()) - 5} more files")
    else:
        print(f"NOT FOUND: {zip_path}")

print(f"\n=== EXTRACTION COMPLETE ===")
print(f"Output: {temp_dir}")

# List all extracted files
print("\n=== All Extracted Files ===")
for root, dirs, files in os.walk(temp_dir):
    level = root.replace(temp_dir, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = ' ' * 2 * (level + 1)
    for file in files[:10]:  # Limit files per folder
        print(f'{subindent}{file}')
