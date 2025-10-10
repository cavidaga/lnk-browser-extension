// Content script for LNK Media Bias Analyzer
// Detects article URLs and communicates with background script

(function() {
  'use strict';

  // Configuration
  const LNK_API_BASE = 'https://lnk.az';
  const NEWS_DOMAINS = [
    'oxu.az', 'publika.az', 'jam-news.net', 'abzas.org', 'abzas.net', 'abzas.info',
    'azadliq.org', 'bbc.com', 'cnn.com', 'reuters.com', 'ap.org', 'bloomberg.com',
    'nytimes.com', 'washingtonpost.com', 'theguardian.com', 'independent.co.uk'
  ];

  // Check if current page is likely a news article
  function isNewsArticle() {
    const url = window.location.href;
    const hostname = window.location.hostname.toLowerCase().replace(/^www\./, '');
    
    // Check if domain is in our news domains list
    const isNewsDomain = NEWS_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
    
    if (!isNewsDomain) return false;
    
    // Check for article indicators in URL
    const articlePatterns = [
      /\/article\//,
      /\/news\//,
      /\/story\//,
      /\/post\//,
      /\/\d{4}\/\d{2}\/\d{2}\//, // Date pattern
      /\/\d+\//, // ID pattern
      /\.html$/,
      /\.php$/,
      /\/[^\/]+\/[^\/]+$/ // Deep path structure
    ];
    
    const hasArticlePattern = articlePatterns.some(pattern => pattern.test(url));
    
    // Check for article indicators in page content
    const hasArticleContent = document.querySelector('article') || 
                             document.querySelector('.article') ||
                             document.querySelector('.news-content') ||
                             document.querySelector('.post-content') ||
                             document.querySelector('[role="article"]');
    
    return hasArticlePattern || hasArticleContent;
  }

  // Extract article title and URL
  function getArticleInfo() {
    const url = window.location.href;
    let title = '';
    
    // Try to get title from various sources
    const titleSelectors = [
      'h1',
      '.article-title',
      '.news-title',
      '.post-title',
      '[data-testid="headline"]',
      'meta[property="og:title"]',
      'title'
    ];
    
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        title = element.textContent?.trim() || element.getAttribute('content')?.trim() || '';
        if (title && title.length > 10) break;
      }
    }
    
    return {
      url: url,
      title: title || document.title || 'Untitled Article',
      hostname: window.location.hostname
    };
  }

  // Add visual indicator to the page
  function addPageIndicator() {
    // Check if indicator already exists
    if (document.getElementById('lnk-extension-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'lnk-extension-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #11131a, #0c0d12);
        color: #e9edf3;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial, 'Noto Sans';
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        cursor: pointer;
        border: 1px solid #1c2230;
        max-width: 320px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="
            width: 10px;
            height: 10px;
            background: #FF0000;
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.3);
          "></div>
          <span style="font-weight: 600;">LNK tərəfindən təhlil edilə bilər</span>
        </div>
        <div style="
          font-size: 12px;
          color: #8e97ab;
          margin-top: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        ">
          Genişlənməni açın və təhlil edin
        </div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1);
          }
        }
      </style>
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 300);
      }
    }, 5000);
    
    // Click to open popup
    indicator.addEventListener('click', () => {
      browser.runtime.sendMessage({ action: 'openPopup' });
    });
  }

  // Add overlay indicators for bias and reliability
  function addOverlayIndicators(analysisData) {
    if (!analysisData || !analysisData.scores) return;
    
    // Remove existing indicators
    removeOverlayIndicators();
    
    const { reliability, political_establishment_bias } = analysisData.scores;
    
    // Create reliability indicator
    if (reliability) {
      const score = typeof reliability.value === 'object' ? reliability.value.score || reliability.value.value || 0 : reliability.value;
      addReliabilityIndicator(score);
    }
    
    // Create bias indicator
    if (political_establishment_bias) {
      const biasScore = typeof political_establishment_bias.value === 'object' ? political_establishment_bias.value.score || political_establishment_bias.value.value || 0 : political_establishment_bias.value;
      addBiasIndicator(biasScore);
    }
    
    // Add site reputation indicator
    addSiteReputationIndicator(analysisData);
  }

  // Add reliability indicator
  function addReliabilityIndicator(reliabilityScore) {
    const indicator = document.createElement('div');
    indicator.id = 'lnk-reliability-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #11131a, #0c0d12);
        color: #e9edf3;
        padding: 12px 16px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,.4);
        font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial, 'Noto Sans';
        font-size: 13px;
        font-weight: 500;
        z-index: 9999;
        border: 1px solid #1c2230;
        min-width: 200px;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600; color: #10b981;">Etibarlılıq</span>
          <span style="font-weight: 700; font-size: 16px; color: #10b981;">${reliabilityScore}%</span>
        </div>
        <div style="
          width: 100%;
          height: 6px;
          background: #1c2230;
          border-radius: 3px;
          overflow: hidden;
        ">
          <div style="
            width: ${reliabilityScore}%;
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
            border-radius: 3px;
            transition: width 0.5s ease;
          "></div>
        </div>
        <div style="
          font-size: 11px;
          color: #8e97ab;
          margin-top: 6px;
          text-align: center;
        ">
          ${getReliabilityLabel(reliabilityScore)}
        </div>
      </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
      indicator.querySelector('div').style.opacity = '1';
      indicator.querySelector('div').style.transform = 'translateX(0)';
    }, 200);
  }

  // Add bias indicator
  function addBiasIndicator(biasScore) {
    const indicator = document.createElement('div');
    indicator.id = 'lnk-bias-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 160px;
        right: 20px;
        background: linear-gradient(135deg, #11131a, #0c0d12);
        color: #e9edf3;
        padding: 12px 16px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,.4);
        font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial, 'Noto Sans';
        font-size: 13px;
        font-weight: 500;
        z-index: 9999;
        border: 1px solid #1c2230;
        min-width: 200px;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600; color: #ef4444;">Siyasi Tərəflilik</span>
          <span style="font-weight: 700; font-size: 16px; color: #ef4444;">${biasScore > 0 ? '+' : ''}${biasScore}</span>
        </div>
        <div style="
          position: relative;
          width: 100%;
          height: 6px;
          background: #1c2230;
          border-radius: 3px;
          margin-bottom: 6px;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 100%;
            background: #8e97ab;
            transform: translate(-50%, -50%);
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: ${50 + (biasScore * 10)}%;
            width: 12px;
            height: 12px;
            background: #ef4444;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid #11131a;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
          "></div>
        </div>
        <div style="
          font-size: 11px;
          color: #8e97ab;
          text-align: center;
        ">
          ${getBiasLabel(biasScore)}
        </div>
      </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
      indicator.querySelector('div').style.opacity = '1';
      indicator.querySelector('div').style.transform = 'translateX(0)';
    }, 300);
  }

  // Add site reputation indicator
  function addSiteReputationIndicator(analysisData) {
    const hostname = window.location.hostname.toLowerCase().replace(/^www\./, '');
    const indicator = document.createElement('div');
    indicator.id = 'lnk-site-reputation';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 240px;
        right: 20px;
        background: linear-gradient(135deg, #11131a, #0c0d12);
        color: #e9edf3;
        padding: 12px 16px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,.4);
        font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial, 'Noto Sans';
        font-size: 13px;
        font-weight: 500;
        z-index: 9999;
        border: 1px solid #1c2230;
        min-width: 200px;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <div style="
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
          "></div>
          <span style="font-weight: 600;">Sayt Reputasiyası</span>
        </div>
        <div style="font-size: 12px; color: #8e97ab; margin-bottom: 4px;">
          ${hostname}
        </div>
        <div style="font-size: 11px; color: #8e97ab;">
          LNK tərəfindən təhlil edilmiş
        </div>
      </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
      indicator.querySelector('div').style.opacity = '1';
      indicator.querySelector('div').style.transform = 'translateX(0)';
    }, 400);
  }

  // Remove overlay indicators
  function removeOverlayIndicators() {
    const indicators = ['lnk-reliability-indicator', 'lnk-bias-indicator', 'lnk-site-reputation'];
    indicators.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    });
  }

  // Get reliability label
  function getReliabilityLabel(score) {
    if (score >= 80) return 'Çox Etibarlı';
    if (score >= 60) return 'Etibarlı';
    if (score >= 40) return 'Orta Etibarlı';
    if (score >= 20) return 'Az Etibarlı';
    return 'Etibarsız';
  }

  // Get bias label
  function getBiasLabel(score) {
    if (score >= 3) return 'Güclü Müsbət';
    if (score >= 1) return 'Müsbət';
    if (score === 0) return 'Neytral';
    if (score >= -2) return 'Tənqidi';
    return 'Güclü Mənfi';
  }

  // Detect website theme
  function detectWebsiteTheme() {
    // Check for dark mode indicators
    const darkModeIndicators = [
      document.documentElement.classList.contains('dark'),
      document.documentElement.classList.contains('dark-mode'),
      document.body.classList.contains('dark'),
      document.body.classList.contains('dark-mode'),
      document.querySelector('meta[name="color-scheme"]')?.content === 'dark',
      document.querySelector('meta[name="theme-color"]')?.content?.includes('dark'),
      window.getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
    ];
    
    // Check for light mode indicators
    const lightModeIndicators = [
      document.documentElement.classList.contains('light'),
      document.documentElement.classList.contains('light-mode'),
      document.body.classList.contains('light'),
      document.body.classList.contains('light-mode'),
      document.querySelector('meta[name="color-scheme"]')?.content === 'light',
      document.querySelector('meta[name="theme-color"]')?.content?.includes('light'),
      window.getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'light'
    ];
    
    if (darkModeIndicators.some(indicator => indicator)) {
      return 'dark';
    } else if (lightModeIndicators.some(indicator => indicator)) {
      return 'light';
    }
    
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Listen for messages from background script
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getArticleInfo') {
      const articleInfo = getArticleInfo();
      sendResponse({
        isNewsArticle: isNewsArticle(),
        articleInfo: articleInfo
      });
    } else if (request.action === 'showIndicator') {
      if (isNewsArticle()) {
        addPageIndicator();
      }
    } else if (request.action === 'showOverlayIndicators') {
      if (request.analysisData) {
        addOverlayIndicators(request.analysisData);
      }
    } else if (request.action === 'hideOverlayIndicators') {
      removeOverlayIndicators();
    } else if (request.action === 'getWebsiteTheme') {
      const theme = detectWebsiteTheme();
      sendResponse({ theme: theme });
    }
  });

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  function initialize() {
    // Check if this is a news article and show indicator
    if (isNewsArticle()) {
      addPageIndicator();
    }
  }

  // Re-check when URL changes (for SPAs)
  let currentUrl = window.location.href;
  const urlCheckInterval = setInterval(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      if (isNewsArticle()) {
        addPageIndicator();
      }
    }
  }, 1000);

  // Clean up interval when page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(urlCheckInterval);
  });

})();
