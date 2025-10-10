#!/usr/bin/env node
/**
 * Build script for LNK Browser Extension
 * Creates a production-ready extension package
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');

async function build() {
  console.log(chalk.blue('🔨 Building LNK Browser Extension...'));
  
  try {
    // Clean dist directory
    await fs.remove(DIST_DIR);
    await fs.ensureDir(DIST_DIR);
    
    // Copy source files
    await fs.copy(SRC_DIR, DIST_DIR);
    
    // Update manifest for production
    await updateManifestForProduction();
    
    // Optimize files
    await optimizeFiles();
    
    console.log(chalk.green('✅ Build completed successfully!'));
    console.log(chalk.gray(`📦 Extension built in: ${DIST_DIR}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error.message);
    process.exit(1);
  }
}

async function updateManifestForProduction() {
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  // Update version if needed
  const packageJson = await fs.readJson(path.join(__dirname, '..', 'package.json'));
  manifest.version = packageJson.version;
  
  // Add production-specific configurations
  manifest.content_security_policy = {
    extension_pages: "script-src 'self'; object-src 'self'"
  };
  
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  console.log(chalk.gray('📝 Updated manifest for production'));
}

async function optimizeFiles() {
  // Skip CSS minification to preserve complex CSS structure
  console.log(chalk.gray('🎨 CSS minification disabled to preserve complex styling'));
  
  // Skip JavaScript minification to avoid syntax errors
  console.log(chalk.gray('⚡ JavaScript minification disabled to prevent syntax errors'));
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };
