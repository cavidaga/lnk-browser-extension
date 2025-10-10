# Installation Guide

This guide will help you install the LNK Media Bias Analyzer browser extension.

## Quick Installation

### From Browser Stores (Recommended)

The easiest way to install the extension is from your browser's official store:

- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/lnk-media-bias-analyzer/your-extension-id)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/lnk-media-bias-analyzer/)
- **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/lnk-media-bias-analyzer/your-extension-id)

### Development Installation

If you want to install the extension from source or for development:

#### Prerequisites

- Node.js 16 or higher
- Git
- A modern web browser (Chrome, Firefox, or Edge)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/cavidaga/lnk-browser-extension.git
cd lnk-browser-extension
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Build the Extension

```bash
npm run build
```

This will create a `dist` folder with the built extension.

#### Step 4: Load the Extension

##### Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Select the `dist` folder from the cloned repository
5. The extension should now appear in your extensions list

##### Firefox

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Navigate to the `dist` folder and select `manifest.json`
5. The extension should now be loaded

##### Edge

1. Open Edge and go to `edge://extensions/`
2. Enable "Developer mode" (toggle in the left sidebar)
3. Click "Load unpacked"
4. Select the `dist` folder from the cloned repository
5. The extension should now appear in your extensions list

## Verification

After installation, you can verify the extension is working:

1. **Check the toolbar**: Look for the LNK extension icon in your browser toolbar
2. **Visit a news site**: Go to a supported news website (e.g., oxu.az, publika.az)
3. **Look for indicators**: You should see a green indicator on news articles
4. **Test analysis**: Click the extension icon and try analyzing an article

## Supported Websites

The extension automatically detects articles on:

- **Azerbaijani News**: oxu.az, publika.az, jam-news.net, abzas.org, abzas.net, abzas.info
- **International News**: BBC, CNN, Reuters, AP, Bloomberg, New York Times, Washington Post, The Guardian
- **And many more...**

## Troubleshooting

### Extension Not Loading

- **Check browser compatibility**: Ensure you're using a supported browser version
- **Enable developer mode**: Make sure developer mode is enabled in your browser
- **Check console errors**: Open browser developer tools and check for errors
- **Try refreshing**: Refresh the extensions page and try loading again

### Analysis Not Working

- **Check internet connection**: The extension requires internet access to analyze articles
- **Verify API access**: Ensure LNK.az API is accessible from your location
- **Check console errors**: Open browser developer tools and check for network errors
- **Try a different article**: Some articles may not be analyzable

### No Visual Indicators

- **Check page type**: The extension only shows indicators on news articles
- **Wait for page load**: Make sure the page has fully loaded
- **Try refreshing**: Refresh the page and check again
- **Check supported sites**: Ensure you're on a supported news website

### Performance Issues

- **Clear cache**: Clear your browser cache and extension data
- **Disable other extensions**: Try disabling other extensions temporarily
- **Check system resources**: Ensure your system has sufficient memory and CPU

## Uninstallation

### From Browser Store

1. Go to your browser's extensions page
2. Find the LNK Media Bias Analyzer extension
3. Click "Remove" or "Uninstall"
4. Confirm the removal

### Development Installation

1. Go to your browser's extensions page
2. Find the LNK Media Bias Analyzer extension
3. Click "Remove" or "Uninstall"
4. Delete the `dist` folder if you no longer need it

## Support

If you encounter any issues:

1. **Check the documentation**: Review this guide and other documentation
2. **Search issues**: Look for similar issues in the [GitHub Issues](https://github.com/cavidaga/lnk-browser-extension/issues)
3. **Create an issue**: If you can't find a solution, create a new issue with details
4. **Contact support**: Reach out to the LNK.az team for assistance

## Privacy Note

The extension only sends article URLs to LNK.az for analysis. No personal data is collected or stored. All communication is encrypted via HTTPS.

---

For more information, visit [LNK.az](https://lnk.az) or the [GitHub repository](https://github.com/cavidaga/lnk-browser-extension).
