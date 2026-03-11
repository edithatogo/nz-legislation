const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const archiveDir = path.join(__dirname);
const extractBase = path.join(archiveDir, 'extracted');

// Create extract directory
if (!fs.existsSync(extractBase)) {
    fs.mkdirSync(extractBase, { recursive: true });
}

const zips = [
    'nz_legislation_conductor_project.zip',
    'nz_legislation_publication_pipeline.zip',
    'nz_legislation_workflow_pack.zip'
];

zips.forEach(zipName => {
    const zipPath = path.join(archiveDir, zipName);
    const extractName = zipName.replace('.zip', '');
    const extractPath = path.join(extractBase, extractName);
    
    console.log(`Extracting ${zipName}...`);
    
    // Create destination folder
    if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
    }
    
    // Use built-in Windows compression via PowerShell
    try {
        execSync(`powershell -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${extractPath}' -Force"`, {
            stdio: 'inherit'
        });
        console.log(`  -> ${extractPath}`);
    } catch (err) {
        console.error(`  Error: ${err.message}`);
    }
});

console.log('\nExtraction complete!');

// List extracted files
console.log('\nExtracted files:');
if (fs.existsSync(extractBase)) {
    const files = execSync('dir /s /b', { cwd: extractBase, encoding: 'utf8' });
    console.log(files);
}
