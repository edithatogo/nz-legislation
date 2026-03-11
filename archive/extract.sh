#!/bin/bash

# Create temp directory
mkdir -p /c/temp/archives

# Copy zip files
cp "/c/Users/60217257/OneDrive - Flinders/Project - 2026.03 - NZ Legislation/archive"/*.zip /c/temp/archives/

# Extract each zip
cd /c/temp/archives
for f in *.zip; do
    echo "Extracting $f..."
    unzip -o "$f"
done

echo "Done!"
ls -la /c/temp/archives/
