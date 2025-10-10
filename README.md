# LNK Media Bias Analyzer - Browser Extension

A browser extension that provides real-time media bias analysis using the LNK.az AI technology. Analyze news articles directly in your browser with one click.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/cavidaga/lnk-browser-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://github.com/cavidaga/lnk-browser-extension)

## Features

- **One-Click Analysis**: Analyze any news article with a single click
- **Real-time Indicators**: Visual indicators appear on news websites
- **Bias Scoring**: Reliability (0-100) and political bias (-5 to +5) analysis
- **Caching**: Results are cached locally for faster access
- **Azerbaijani Language**: Full UI support in Azerbaijani
- **Cross-Platform**: Works on Chrome, Firefox, and Edge
- **Privacy-Focused**: Only sends article URLs to LNK.az API

## Supported Websites

The extension automatically detects articles on major news websites including:

- **Azerbaijani News**: oxu.az, publika.az, jam-news.net, abzas.org
- **International News**: BBC, CNN, Reuters, AP, Bloomberg
- **And many more...**

## Installation

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

1. **Automatic Detection**: The extension automatically detects news articles and shows a green indicator
2. **Manual Analysis**: Click the extension icon to analyze the current page
3. **View Results**: See reliability and bias scores in the popup
4. **Full Analysis**: Click "Tam təhlil" to view detailed analysis on LNK.az

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

The extension integrates with the LNK.az API:

- **Analysis Endpoint**: `POST /api/analyze`
- **Cached Results**: `GET /api/get-analysis`
- **Full Analysis**: `GET /analysis/:hash`

### Building for Different Browsers

The extension supports Chrome, Firefox, and Edge with the same codebase. The build process automatically generates browser-specific manifests when needed.

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

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/cavidaga/lnk-browser-extension/issues)
- **LNK.az**: [https://lnk.az](https://lnk.az)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by the LNK.az team
