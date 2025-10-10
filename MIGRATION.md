# Migration Guide: From LNK.az Repository

This document explains how to migrate the LNK Browser Extension from the main LNK.az repository to this standalone repository.

## What Was Migrated

### Source Code
- ✅ `manifest.json` - Extension manifest
- ✅ `background.js` - Service worker
- ✅ `content.js` - Content script
- ✅ `popup.html` - Popup interface
- ✅ `popup.js` - Popup functionality
- ✅ `popup-styles.css` → `popup.css` - Styling
- ✅ `icons/` - All icon sizes (16x16, 32x32, 48x48, 128x128)
- ✅ `test-page.html` - Test page

### New Structure
The extension has been reorganized into a proper project structure:

```
lnk-browser-extension/
├── src/                    # Source code (migrated from extension/)
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── icons/
├── docs/                   # Documentation
├── scripts/                # Build and deployment tools
├── tests/                  # Testing infrastructure
├── .github/workflows/      # CI/CD pipelines
└── dist/                   # Built extension (generated)
```

## Key Changes

### 1. File Organization
- **Before**: All files in `extension/` folder
- **After**: Organized into `src/` with proper subdirectories

### 2. Build System
- **Before**: Manual file copying
- **After**: Automated build process with `npm run build`

### 3. Dependencies
- **Before**: No package management
- **After**: `package.json` with proper dependencies and scripts

### 4. Documentation
- **Before**: Basic README
- **After**: Comprehensive documentation suite

### 5. CI/CD
- **Before**: No automation
- **After**: GitHub Actions for building, testing, and releasing

## New Features

### Build Scripts
```bash
npm run build          # Build extension for production
npm run package        # Create distribution packages
npm run test           # Run tests
npm run lint           # Lint code
npm run dev            # Development server with auto-rebuild
npm run release        # Create new release
```

### Browser Support
- **Chrome**: 88+
- **Firefox**: 91+
- **Edge**: 88+

### Automated Packaging
- Creates browser-specific packages
- Generates zip files for distribution
- Optimizes files for production

## Migration Steps

### 1. Repository Setup
```bash
# Clone the new repository
git clone https://github.com/cavidaga/lnk-browser-extension.git
cd lnk-browser-extension

# Install dependencies
npm install

# Build the extension
npm run build
```

### 2. Development Workflow
```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Create release
npm run release
```

### 3. Browser Installation
1. Go to `chrome://extensions/` (or equivalent)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Configuration

### Environment Variables
The extension uses the following configuration:

- **API Base URL**: `https://lnk.az` (production)
- **Rate Limiting**: 10 requests per minute
- **Cache Duration**: 30 days
- **Supported Browsers**: Chrome, Firefox, Edge

### Customization
You can customize the extension by modifying:

- `src/manifest.json` - Extension configuration
- `src/popup/popup.css` - Styling
- `src/background.js` - Background logic
- `src/content.js` - Content script behavior

## Testing

### Manual Testing
1. Load the extension in your browser
2. Visit supported news websites
3. Test analysis functionality
4. Verify caching behavior

### Automated Testing
```bash
npm test
```

Tests cover:
- File structure validation
- Manifest validation
- Build process
- File size optimization

## Deployment

### Chrome Web Store
1. Build the extension: `npm run build`
2. Package for Chrome: `npm run package`
3. Upload `packages/lnk-browser-extension-chrome-v*.zip`

### Firefox Add-ons
1. Use the Firefox package: `packages/lnk-browser-extension-firefox-v*.zip`
2. Submit to Mozilla Add-ons

### Edge Add-ons
1. Use the Edge package: `packages/lnk-browser-extension-edge-v*.zip`
2. Submit to Microsoft Edge Add-ons

## Maintenance

### Updates
- **Version Management**: Semantic versioning
- **Changelog**: Automated changelog generation
- **Releases**: GitHub Actions for automated releases

### Monitoring
- **Build Status**: GitHub Actions
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## Support

### Documentation
- **README.md**: Main documentation
- **docs/INSTALL.md**: Installation guide
- **docs/API.md**: API documentation
- **docs/CONTRIBUTING.md**: Contribution guide

### Community
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **LNK.az**: Main platform support

## Benefits of Migration

### 1. Independence
- Separate development cycle
- Independent versioning
- Focused maintenance

### 2. Professional Structure
- Proper project organization
- Build automation
- Testing infrastructure

### 3. Browser Store Ready
- Automated packaging
- Browser-specific builds
- Store submission ready

### 4. Community Friendly
- Clear contribution guidelines
- Issue templates
- Documentation

## Next Steps

1. **Set up the repository** on GitHub
2. **Configure CI/CD** with your GitHub account
3. **Test the build process** locally
4. **Submit to browser stores** when ready
5. **Monitor and maintain** the extension

---

The LNK Browser Extension is now ready for independent development and distribution! 🎉
