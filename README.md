# LNK Media Bias Analyzer - Browser Extension

A modern browser extension that provides real-time media bias analysis using the LNK.az AI technology. Analyze news articles directly in your browser with one click, featuring a sleek design that matches the current LNK.az website.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/cavidaga/lnk-browser-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://github.com/cavidaga/lnk-browser-extension)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-brightgreen.svg)](https://chromewebstore.google.com/detail/lnk-media-bias-analyzer/lclhkkckmddipgmiaiahijeaealoikjm)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Available-ff7139.svg)](https://addons.mozilla.org/en-US/firefox/addon/lnk-media-bias-analyzer/)
[![Microsoft Edge Add-ons](https://img.shields.io/badge/Microsoft%20Edge%20Add--ons-Available-0078D7.svg)](https://microsoftedge.microsoft.com/addons/detail/lnk-media-bias-analyzer/fkplnhodhplcookmgcnhehmfgaeffffd)

<!-- Store badges are shown above; removing duplicate store-specific sections to avoid repetition. -->

## Features

- **🎯 One-Click Analysis**: Analyze any news article with a single click
- **✨ Modern Design**: Sleek interface matching the current LNK.az website design
- **📊 Advanced Scoring**: Reliability (0-100) and political bias (-5 to +5) analysis
- **⚡ Smart Caching**: Results are cached locally for faster access
- **🌍 Azerbaijani Language**: Full UI support in Azerbaijani
- **🔒 Privacy-Focused**: Only sends article URLs to LNK.az API
- **🌐 Cross-Platform**: Works on Chrome, Firefox, and Edge
- **🎨 Dark Theme**: Beautiful dark theme with modern visual indicators
- **📱 Responsive**: Optimized for all screen sizes
- **🔄 Real-time Updates**: Visual indicators appear automatically on news websites

## Supported Websites

The extension automatically detects articles on major news websites including:

- **Azerbaijani News**: oxu.az, publika.az, jam-news.net, abzas.org
- **International News**: BBC, CNN, Reuters, AP, Bloomberg
- **And many more...**

## Installation

Install from your browser's store using the badges at the top of this README, or use manual installation for development below.

### Manual Installation (Development)

For local development or manual loading:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cavidaga/lnk-browser-extension.git
   cd lnk-browser-extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in your browser**:
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select the `dist` folder
   - **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select `dist-firefox/manifest.json`
   - **Edge**: Go to `edge://extensions/`, enable "Developer mode", click "Load unpacked", select the `dist` folder

## Usage

1. **🔍 Automatic Detection**: The extension automatically detects news articles and shows a modern green indicator
2. **🖱️ Manual Analysis**: Click the extension icon to analyze the current page
3. **📊 View Results**: See reliability and bias scores in the sleek popup interface
4. **🔗 Full Analysis**: Click "Tam təhlil" to view detailed analysis on LNK.az
5. **💾 Cached Results**: Previously analyzed articles load instantly from cache
6. **🎨 Visual Indicators**: Modern overlay indicators show analysis results directly on the page

## Development

### Project Structure

```
lnk-browser-extension/
├── src/                    # Source code
│   ├── manifest.json      # Extension manifest (Chrome/Edge)
│   ├── background.js      # Service worker
│   ├── content.js         # Content script
│   ├── popup/             # Popup interface
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── icons/             # Extension icons
├── dist/                  # Built Chrome/Edge extension
├── dist-firefox/          # Built Firefox extension
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
└── tests/                 # Extension tests
```

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run package` - Package the extension for distribution
- `npm run test` - Run extension tests
- `npm run lint` - Lint JavaScript files
- `npm run dev` - Start development server

### API Integration

The extension integrates with the updated LNK.az API:

- **Analysis Endpoint**: `POST /api/analyze` - Submit articles for analysis
- **Cached Results**: `GET /api/get-analysis?id=:hash` - Retrieve analysis by hash
- **Full Analysis**: `GET /analysis/:hash` - View detailed analysis on website
- **Enhanced Error Handling**: Improved API response validation and error messages
- **Data Structure Support**: Compatible with both legacy and new API response formats

### Building for Different Browsers

The extension supports Chrome, Firefox, and Edge with the same codebase. The build process automatically generates browser-specific manifests when needed.

## What's New in v2.0.0

### 🎨 **Modern Design System**
- **Updated UI**: Complete redesign matching the current LNK.az website
- **CSS Variables**: Modern design system with consistent colors and typography
- **Poppins Font**: Enhanced typography for better readability
- **Dark Theme**: Beautiful dark theme with improved contrast

### 🔧 **Technical Improvements**
- **Enhanced API Integration**: Updated to work with current LNK.az API endpoints
- **Better Error Handling**: Improved error messages and API response validation
- **Data Structure Support**: Compatible with both old and new API response formats
- **Performance**: Optimized caching and storage management

### 🎯 **User Experience**
- **Modern Indicators**: Sleek visual indicators with improved animations
- **Responsive Design**: Optimized for all screen sizes
- **Better Feedback**: Enhanced loading states and user interactions
- **Improved Accessibility**: Better contrast and keyboard navigation

### 🛠️ **Developer Experience**
- **Updated Manifest**: Version 2.0.0 with improved permissions
- **Better Code Structure**: Cleaner, more maintainable codebase
- **Enhanced Documentation**: Comprehensive README and code comments

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure cross-browser compatibility

## Privacy

- The extension only sends article URLs to LNK.az for analysis
- No personal data is collected or stored
- Analysis results are cached locally in your browser
- All communication is encrypted via HTTPS

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- Removed mid-page Store Listings to reduce repetition; links remain at top and in Support. -->

## Support

- **Chrome Web Store**: [Rate and Review](https://chromewebstore.google.com/detail/lnk-media-bias-analyzer/lclhkkckmddipgmiaiahijeaealoikjm)
- **Firefox Add-ons**: [Rate and Review](https://addons.mozilla.org/en-US/firefox/addon/lnk-media-bias-analyzer/)
- **Microsoft Edge Add-ons**: [Rate and Review](https://microsoftedge.microsoft.com/addons/detail/lnk-media-bias-analyzer/fkplnhodhplcookmgcnhehmfgaeffffd)
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/cavidaga/lnk-browser-extension/issues)
- **LNK.az**: [https://lnk.az](https://lnk.az)

## Changelog

### v2.0.0 (Latest)
- 🎨 Complete UI redesign matching LNK.az website
- 🔧 Updated API integration with current endpoints
- ✨ Modern design system with CSS variables
- 🎯 Enhanced user experience and visual indicators
- 📱 Improved responsive design
- 🛠️ Better error handling and data structure support

### v1.0.0
- 🚀 Initial release with core functionality
- 📊 Basic bias analysis and reliability scoring
- 🌍 Azerbaijani language support
- 🔒 Privacy-focused design

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

Made with ❤️ by the LNK.az team
