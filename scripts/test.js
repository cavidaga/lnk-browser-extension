#!/usr/bin/env node
/**
 * Test script for LNK Browser Extension
 * Runs basic validation tests
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');

async function runTests() {
  console.log(chalk.blue('🧪 Running LNK Browser Extension Tests...'));
  
  let passed = 0;
  let failed = 0;
  
  try {
    // Test 1: Check if source files exist
    await testSourceFiles();
    passed++;
    
    // Test 2: Validate manifest.json
    await testManifest();
    passed++;
    
    // Test 3: Check if build works
    await testBuild();
    passed++;
    
    // Test 4: Validate built extension
    await testBuiltExtension();
    passed++;
    
    // Test 5: Check file sizes
    await testFileSizes();
    passed++;
    
    console.log(chalk.green(`\n✅ Tests completed: ${passed} passed, ${failed} failed`));
    
    if (failed > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    failed++;
    process.exit(1);
  }
}

async function testSourceFiles() {
  console.log(chalk.gray('  📁 Checking source files...'));
  
  const requiredFiles = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup/popup.html',
    'popup/popup.js',
    'popup/popup.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(SRC_DIR, file);
    if (!await fs.pathExists(filePath)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  
  console.log(chalk.green('    ✅ All source files present'));
}

async function testManifest() {
  console.log(chalk.gray('  📋 Validating manifest.json...'));
  
  const manifestPath = path.join(SRC_DIR, 'manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  // Check required fields
  const requiredFields = ['manifest_version', 'name', 'version', 'description'];
  for (const field of requiredFields) {
    if (!manifest[field]) {
      throw new Error(`Missing required field in manifest: ${field}`);
    }
  }
  
  // Check version format
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error('Invalid version format in manifest');
  }
  
  // Check manifest version
  if (manifest.manifest_version !== 3) {
    throw new Error('Manifest version must be 3');
  }
  
  console.log(chalk.green('    ✅ Manifest is valid'));
}

async function testBuild() {
  console.log(chalk.gray('  🔨 Testing build process...'));
  
  // Import and run build
  const { build } = require('./build');
  await build();
  
  if (!await fs.pathExists(DIST_DIR)) {
    throw new Error('Build failed: dist directory not created');
  }
  
  console.log(chalk.green('    ✅ Build process works'));
}

async function testBuiltExtension() {
  console.log(chalk.gray('  📦 Validating built extension...'));
  
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (!await fs.pathExists(manifestPath)) {
    throw new Error('Built manifest.json not found');
  }
  
  const manifest = await fs.readJson(manifestPath);
  
  // Check that all required files exist in dist
  const requiredFiles = [
    'background.js',
    'content.js',
    'popup/popup.html',
    'popup/popup.js',
    'popup/popup.css'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(DIST_DIR, file);
    if (!await fs.pathExists(filePath)) {
      throw new Error(`Missing built file: ${file}`);
    }
  }
  
  console.log(chalk.green('    ✅ Built extension is valid'));
}

async function testFileSizes() {
  console.log(chalk.gray('  📏 Checking file sizes...'));
  
  const maxSizes = {
    'background.js': 50 * 1024, // 50KB
    'content.js': 100 * 1024,   // 100KB
    'popup/popup.js': 50 * 1024, // 50KB
    'popup/popup.css': 20 * 1024, // 20KB
    'popup/popup.html': 10 * 1024 // 10KB
  };
  
  for (const [file, maxSize] of Object.entries(maxSizes)) {
    const filePath = path.join(DIST_DIR, file);
    if (await fs.pathExists(filePath)) {
      const stats = await fs.stat(filePath);
      if (stats.size > maxSize) {
        console.log(chalk.yellow(`    ⚠️  ${file} is ${(stats.size / 1024).toFixed(1)}KB (max: ${(maxSize / 1024).toFixed(1)}KB)`));
      } else {
        console.log(chalk.green(`    ✅ ${file} size OK (${(stats.size / 1024).toFixed(1)}KB)`));
      }
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
