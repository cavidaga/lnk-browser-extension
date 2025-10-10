# Contributing to LNK Browser Extension

Thank you for your interest in contributing to the LNK Browser Extension! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- Git
- A modern web browser (Chrome, Firefox, or Edge)
- Basic knowledge of JavaScript, HTML, and CSS
- Familiarity with browser extension development

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/lnk-browser-extension.git
   cd lnk-browser-extension
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the extension**:
   ```bash
   npm run build
   ```
5. **Load the extension** in your browser for testing

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(popup): add dark mode toggle
fix(content): resolve article detection issue
docs(api): update API documentation
```

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Run linting and tests**:
   ```bash
   npm run lint
   npm test
   ```
6. **Commit your changes** with descriptive messages
7. **Push to your fork** and create a pull request
8. **Fill out the PR template** completely

## Coding Standards

### JavaScript

- Use ES6+ features
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors gracefully
- Use async/await instead of callbacks when possible

```javascript
// Good
async function analyzeArticle(url) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

// Bad
function analyzeArticle(url) {
  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
  }).then(data => {
    // handle data
  });
}
```

### HTML

- Use semantic HTML elements
- Include proper ARIA attributes for accessibility
- Keep structure clean and organized
- Use consistent indentation (2 spaces)

### CSS

- Use consistent naming conventions
- Organize styles logically
- Use CSS custom properties for theming
- Write responsive styles
- Avoid inline styles

```css
/* Good */
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--header-bg, #121622);
}

/* Bad */
.container { display: flex; flex-direction: column; height: 100%; min-height: 500px; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #121622; }
```

## Testing

### Manual Testing

1. **Load the extension** in your browser
2. **Test on different websites** (supported and unsupported)
3. **Test different scenarios**:
   - New articles (not analyzed)
   - Cached articles (previously analyzed)
   - Error conditions (network issues, API errors)
   - Different browser types

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- Aim for at least 80% code coverage
- Test critical functionality thoroughly
- Include edge cases and error conditions
- Test cross-browser compatibility

## File Structure

```
src/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script
├── popup/                # Popup interface
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/                # Extension icons
└── assets/               # Other assets

tests/
├── unit/                 # Unit tests
├── e2e/                  # End-to-end tests
└── test-pages/           # Test HTML pages

docs/                     # Documentation
scripts/                  # Build and deployment scripts
```

## Browser Compatibility

The extension should work on:
- **Chrome**: 88+
- **Firefox**: 91+
- **Edge**: 88+

Test your changes on all supported browsers.

## Performance Considerations

- **Minimize API calls** - Use caching effectively
- **Optimize bundle size** - Keep the extension lightweight
- **Efficient DOM manipulation** - Avoid unnecessary reflows
- **Memory management** - Clean up event listeners and timers
- **Lazy loading** - Load resources only when needed

## Security

- **Content Security Policy** - Follow CSP guidelines
- **Input validation** - Validate all user inputs
- **Secure communication** - Use HTTPS for all API calls
- **Permission model** - Request only necessary permissions
- **Data handling** - Handle sensitive data appropriately

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Keep comments up-to-date

### User Documentation

- Update README.md for significant changes
- Add installation instructions for new features
- Document configuration options
- Include troubleshooting information

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Extension tested on all browsers
- [ ] Build artifacts generated
- [ ] Release notes prepared

## Getting Help

### Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Edge Extension Documentation](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/)

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Discord**: Join our community server (if available)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Focus on what's best for the community
- Show empathy towards other community members
- Accept constructive criticism gracefully
- Help others learn and grow

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks or political discussions
- Spam or off-topic discussions

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Community acknowledgments

## Questions?

If you have any questions about contributing:

1. **Check existing issues** and discussions
2. **Create a new issue** with the "question" label
3. **Join our community** discussions
4. **Contact maintainers** directly

Thank you for contributing to the LNK Browser Extension! 🎉
