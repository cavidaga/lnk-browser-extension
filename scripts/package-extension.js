#!/usr/bin/env node
/**
 * Package script for LNK Browser Extension
 * Creates a zip file for distribution
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PACKAGE_DIR = path.join(__dirname, '..', 'packages');

async function packageExtension() {
  console.log(chalk.blue('📦 Packaging LNK Browser Extension...'));
  
  try {
    // Ensure dist directory exists
    if (!await fs.pathExists(DIST_DIR)) {
      console.log(chalk.yellow('⚠️  Dist directory not found. Running build first...'));
      const { build } = require('./build');
      await build();
    }
    
    // Create packages directory
    await fs.ensureDir(PACKAGE_DIR);
    
    // Read package.json for version
    const packageJson = await fs.readJson(path.join(__dirname, '..', 'package.json'));
    const version = packageJson.version;
    
    // Create zip file
    const zipPath = path.join(PACKAGE_DIR, `lnk-browser-extension-v${version}.zip`);
    await createZip(DIST_DIR, zipPath);
    
    console.log(chalk.green('✅ Extension packaged successfully!'));
    console.log(chalk.gray(`📦 Package created: ${zipPath}`));
    
    // Create browser-specific packages
    await createBrowserSpecificPackages(version);
    
  } catch (error) {
    console.error(chalk.red('❌ Packaging failed:'), error.message);
    process.exit(1);
  }
}

async function createZip(sourceDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(chalk.gray(`📦 Created zip: ${archive.pointer()} bytes`));
      resolve();
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function createBrowserSpecificPackages(version) {
  const browsers = ['chrome', 'firefox', 'edge'];
  
  for (const browser of browsers) {
    const browserDir = path.join(PACKAGE_DIR, browser);
    await fs.ensureDir(browserDir);
    
    // Copy dist files
    await fs.copy(DIST_DIR, browserDir);
    
    // Update manifest for specific browser
    await updateManifestForBrowser(browser, browserDir);
    
    // Create zip for this browser
    const zipPath = path.join(PACKAGE_DIR, `lnk-browser-extension-${browser}-v${version}.zip`);
    await createZip(browserDir, zipPath);
    
    console.log(chalk.gray(`📦 Created ${browser} package`));
  }
}

async function updateManifestForBrowser(browser, browserDir) {
  const manifestPath = path.join(browserDir, 'manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  // Browser-specific manifest updates
  switch (browser) {
    case 'firefox':
      // Firefox-specific configurations
      manifest.browser_specific_settings = {
        gecko: {
          id: 'lnk-media-bias-analyzer@lnk.az',
          strict_min_version: '91.0'
        }
      };
      break;
      
    case 'edge':
      // Edge-specific configurations
      manifest.minimum_chrome_version = '88.0.4324.150';
      break;
      
    case 'chrome':
      // Chrome-specific configurations
      manifest.minimum_chrome_version = '88.0.4324.150';
      break;
  }
  
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

// Run packaging if called directly
if (require.main === module) {
  packageExtension();
}

module.exports = { packageExtension };
