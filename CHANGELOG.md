# Changelog

All notable changes to the LNK Browser Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No changes yet.

## [2.0.0] - 2025-01-27

### Added
- **Modern Design System**: Complete UI redesign matching current LNK.az website
- **CSS Variables**: Modern design system with consistent colors and typography
- **Enhanced API Integration**: Updated to work with current LNK.az API endpoints
- **Better Error Handling**: Improved error messages and API response validation
- **Data Structure Support**: Compatible with both legacy and new API response formats
- **Poppins Font**: Enhanced typography for better readability
- **Dark Theme**: Beautiful dark theme with improved contrast
- **Modern Visual Indicators**: Sleek overlay indicators with improved animations
- **Responsive Design**: Optimized for all screen sizes
- **Enhanced Accessibility**: Better contrast and keyboard navigation

### Changed
- **UI/UX**: Complete redesign of popup interface and content script indicators
- **API Integration**: Updated endpoints and improved data handling
- **Performance**: Optimized caching and storage management
- **Code Structure**: Cleaner, more maintainable codebase
- **Manifest**: Updated to version 2.0.0 with improved permissions

### Technical
- **CSS Variables**: Implemented modern design system with CSS custom properties
- **API Compatibility**: Support for both old and new API response formats
- **Error Handling**: Enhanced error handling and user feedback
- **Storage**: Improved local storage and caching mechanisms
- **Cross-browser**: Enhanced compatibility across Chrome, Firefox, and Edge

## [1.0.0] - 2025-10-10

### Added
- Initial release of LNK Browser Extension
- One-click analysis of news articles
- Real-time visual indicators on news websites
- Bias scoring with reliability (0-100) and political bias (-5 to +5)
- Local caching of analysis results
- Support for major Azerbaijani and international news websites
- Cross-browser support (Chrome, Firefox, Edge)
- Azerbaijani language interface
- Privacy-focused design (only sends URLs to LNK.az API)

### Features
- Automatic detection of news articles
- Popup interface for analysis results
- Cached analysis loading
- Error handling and retry functionality
- Full analysis integration with LNK.az website
- Modern, responsive UI design

### Technical
- Manifest V3 compliance
- Content Security Policy implementation
- Service worker architecture
- Storage API integration
- Cross-origin request handling
- Icon optimization for all required sizes

---

## Version History

- **2.0.0**: Major redesign with modern UI and enhanced API integration
- **1.0.0**: Initial release with core functionality
- **Unreleased**: Future features and improvements

## How to Read This Changelog

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Contributing

When adding entries to this changelog, please follow these guidelines:

1. Add entries in reverse chronological order (newest first)
2. Use clear, descriptive language
3. Group related changes together
4. Include version numbers and dates
5. Reference issue numbers when applicable

## Links

- [LNK.az Website](https://lnk.az)
- [GitHub Repository](https://github.com/cavidaga/lnk-browser-extension)
- [Chrome Web Store](https://chromewebstore.google.com/detail/lnk-media-bias-analyzer/lclhkkckmddipgmiaiahijeaealoikjm)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/lnk-media-bias-analyzer/)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/lnk-media-bias-analyzer/fkplnhodhplcookmgcnhehmfgaeffffd)
