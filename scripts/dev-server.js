#!/usr/bin/env node
/**
 * Development server for LNK Browser Extension
 * Watches for changes and rebuilds automatically
 */

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');

let isBuilding = false;

async function startDevServer() {
  console.log(chalk.blue('🚀 Starting LNK Browser Extension Dev Server...'));
  
  try {
    // Initial build
    console.log(chalk.gray('📦 Building extension...'));
    await build();
    
    // Watch for changes
    console.log(chalk.gray('👀 Watching for changes...'));
    const watcher = chokidar.watch(SRC_DIR, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });
    
    watcher.on('change', async (filePath) => {
      if (isBuilding) return;
      
      console.log(chalk.yellow(`📝 File changed: ${path.relative(SRC_DIR, filePath)}`));
      await build();
    });
    
    watcher.on('add', async (filePath) => {
      if (isBuilding) return;
      
      console.log(chalk.green(`➕ File added: ${path.relative(SRC_DIR, filePath)}`));
      await build();
    });
    
    watcher.on('unlink', async (filePath) => {
      if (isBuilding) return;
      
      console.log(chalk.red(`🗑️  File removed: ${path.relative(SRC_DIR, filePath)}`));
      await build();
    });
    
    console.log(chalk.green('✅ Dev server started!'));
    console.log(chalk.gray('   - Extension built in: dist/'));
    console.log(chalk.gray('   - Load the dist/ folder in your browser'));
    console.log(chalk.gray('   - Press Ctrl+C to stop'));
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping dev server...'));
      watcher.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Dev server failed:'), error.message);
    process.exit(1);
  }
}

async function build() {
  if (isBuilding) return;
  
  isBuilding = true;
  const startTime = Date.now();
  
  try {
    // Clean dist directory
    await fs.remove(DIST_DIR);
    await fs.ensureDir(DIST_DIR);
    
    // Copy source files
    await fs.copy(SRC_DIR, DIST_DIR);
    
    // Update manifest for development
    await updateManifestForDevelopment();
    
    const duration = Date.now() - startTime;
    console.log(chalk.green(`✅ Build completed in ${duration}ms`));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error.message);
  } finally {
    isBuilding = false;
  }
}

async function updateManifestForDevelopment() {
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  // Add development-specific configurations
  manifest.name = `${manifest.name} (Dev)`;
  manifest.version_name = `${manifest.version} (Development)`;
  
  // Add development permissions if needed
  if (!manifest.permissions.includes('debugger')) {
    manifest.permissions.push('debugger');
  }
  
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

// Run dev server if called directly
if (require.main === module) {
  startDevServer();
}

module.exports = { startDevServer };
