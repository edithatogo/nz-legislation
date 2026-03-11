import zipfile
import os
import shutil

# First copy zips to simple path
src = r"C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\archive"
dst = r"C:\temp\zips"
os.makedirs(dst, exist_ok=True)

print("Copying zips to C:\\temp\\zips...")
for name in ["nz_legislation_conductor_project.zip", "nz_legislation_publication_pipeline.zip", "nz_legislation_workflow_pack.zip"]:
    shutil.copy(os.path.join(src, name), dst)
    print(f"  Copied {name}")

# Extract each
extract_base = r"C:\temp\extracted"
os.makedirs(extract_base, exist_ok=True)

print("\nExtracting...")
for name in ["nz_legislation_conductor_project.zip", "nz_legislation_publication_pipeline.zip", "nz_legislation_workflow_pack.zip"]:
    zip_path = os.path.join(dst, name)
    folder_name = name.replace(".zip", "").replace("nz_legislation_", "")
    extract_path = os.path.join(extract_base, folder_name)
    os.makedirs(extract_path, exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(extract_path)
        files = zf.namelist()
        print(f"\n{folder_name}: {len(files)} files")
        for f in files[:10]:
            print(f"  {f}")
        if len(files) > 10:
            print(f"  ... and {len(files)-10} more")

print(f"\nDone! Files extracted to {extract_base}")
