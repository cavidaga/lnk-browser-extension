#!/usr/bin/env node
/**
 * Release script for LNK Browser Extension
 * Handles version bumping and release preparation
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const semver = require('semver');

const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const CHANGELOG_PATH = path.join(__dirname, '..', 'CHANGELOG.md');

async function release() {
  console.log(chalk.blue('🚀 LNK Browser Extension Release Tool'));
  
  try {
    // Read current version
    const packageJson = await fs.readJson(PACKAGE_JSON_PATH);
    const currentVersion = packageJson.version;
    
    console.log(chalk.gray(`Current version: ${currentVersion}`));
    
    // Ask for release type
    const { releaseType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'releaseType',
        message: 'What type of release is this?',
        choices: [
          { name: 'Patch (bug fixes)', value: 'patch' },
          { name: 'Minor (new features)', value: 'minor' },
          { name: 'Major (breaking changes)', value: 'major' },
          { name: 'Pre-release', value: 'prerelease' }
        ]
      }
    ]);
    
    // Calculate new version
    const newVersion = semver.inc(currentVersion, releaseType);
    
    if (!newVersion) {
      throw new Error('Invalid version increment');
    }
    
    console.log(chalk.gray(`New version: ${newVersion}`));
    
    // Confirm release
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to release version ${newVersion}?`,
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Release cancelled'));
      return;
    }
    
    // Update package.json
    await updatePackageJson(newVersion);
    
    // Update changelog
    await updateChangelog(newVersion, releaseType);
    
    // Build extension
    console.log(chalk.gray('Building extension...'));
    const { build } = require('./build');
    await build();
    
    // Package extension
    console.log(chalk.gray('Packaging extension...'));
    const { packageExtension } = require('./package-extension');
    await packageExtension();
    
    // Create git tag
    console.log(chalk.gray('Creating git tag...'));
    await createGitTag(newVersion);
    
    console.log(chalk.green(`✅ Release ${newVersion} prepared successfully!`));
    console.log(chalk.gray('Next steps:'));
    console.log(chalk.gray('1. Review the changes'));
    console.log(chalk.gray('2. Push the tag: git push origin v' + newVersion));
    console.log(chalk.gray('3. Create a GitHub release'));
    console.log(chalk.gray('4. Upload packages to browser stores'));
    
  } catch (error) {
    console.error(chalk.red('❌ Release failed:'), error.message);
    process.exit(1);
  }
}

async function updatePackageJson(newVersion) {
  const packageJson = await fs.readJson(PACKAGE_JSON_PATH);
  packageJson.version = newVersion;
  await fs.writeJson(PACKAGE_JSON_PATH, packageJson, { spaces: 2 });
  console.log(chalk.green(`✅ Updated package.json to version ${newVersion}`));
}

async function updateChangelog(newVersion, releaseType) {
  const changelog = await fs.readFile(CHANGELOG_PATH, 'utf8');
  
  const today = new Date().toISOString().split('T')[0];
  const versionHeader = `## [${newVersion}] - ${today}`;
  
  const releaseNotes = getReleaseNotes(releaseType);
  
  const newChangelog = changelog.replace(
    '## [Unreleased]',
    `## [Unreleased]\n\n${versionHeader}\n\n${releaseNotes}`
  );
  
  await fs.writeFile(CHANGELOG_PATH, newChangelog);
  console.log(chalk.green(`✅ Updated CHANGELOG.md for version ${newVersion}`));
}

function getReleaseNotes(releaseType) {
  const baseNotes = {
    patch: [
      '### Fixed',
      '- Bug fixes and improvements',
      '- Performance optimizations'
    ],
    minor: [
      '### Added',
      '- New features and enhancements',
      '- Improved user experience'
    ],
    major: [
      '### Added',
      '- Major new features',
      '- Significant improvements'
    ],
    prerelease: [
      '### Added',
      '- Experimental features',
      '- Beta improvements'
    ]
  };
  
  return baseNotes[releaseType].join('\n');
}

async function createGitTag(version) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    await execAsync(`git add .`);
    await execAsync(`git commit -m "chore: release v${version}"`);
    await execAsync(`git tag v${version}`);
    console.log(chalk.green(`✅ Created git tag v${version}`));
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Git operations failed: ${error.message}`));
    console.log(chalk.gray('You may need to commit changes manually'));
  }
}

// Run release if called directly
if (require.main === module) {
  release();
}

module.exports = { release };
