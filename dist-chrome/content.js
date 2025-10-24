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
        border: 1px solid #2a2d3a;
        max-width: 320px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
