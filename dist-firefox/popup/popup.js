// Popup script for LNK Media Bias Analyzer
// Handles user interactions and displays analysis results

let currentTab = null;
let currentAnalysis = null;

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get current active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];
    
    if (!currentTab) {
      showError('Aktiv tab tapılmadı');
      return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize theme detection
    initializeThemeDetection();
    
    // Show brief loading state while checking for cached analysis
    showLoading('Keş yoxlanılır...');
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Always try to load cached analysis first, regardless of page type
    const hasCachedAnalysis = await loadCachedAnalysis();
    
    // If no cached analysis, check if current page is analyzable
    if (!hasCachedAnalysis) {
      try {
        const response = await browser.tabs.sendMessage(currentTab.id, { action: 'getArticleInfo' });
        
        if (response && response.isNewsArticle) {
          showNoAnalysis();
        } else {
          showNoAnalysis();
        }
      } catch (error) {
        console.warn('Could not check if page is news article:', error);
        showNoAnalysis();
      }
    }
  } catch (error) {
    console.error('Popup initialization error:', error);
    showError('Genişlənmə başlatıla bilmədi');
  }
});

// Set up event listeners for all buttons
function setupEventListeners() {
  // Analyze current page button (in analysis results)
  const analyzeBtn = document.getElementById('analyzeCurrentPageBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeCurrentPage);
  }
  
  // Analyze current page button (in no analysis state)
  const analyzeBtnNoAnalysis = document.getElementById('analyzeCurrentPageBtnNoAnalysis');
  if (analyzeBtnNoAnalysis) {
    analyzeBtnNoAnalysis.addEventListener('click', analyzeCurrentPage);
  }
  
  // Retry analysis button
  const retryBtn = document.getElementById('retryAnalysisBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', retryAnalysis);
  }
  
  // Open full analysis button
  const openFullBtn = document.getElementById('openFullAnalysisBtn');
  if (openFullBtn) {
    openFullBtn.addEventListener('click', openFullAnalysis);
  }
}

// Load cached analysis if available
async function loadCachedAnalysis() {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'getCachedAnalysis',
      url: currentTab.url
    });
    
    if (response.success && response.data) {
      currentAnalysis = response.data;
      displayAnalysisResults(response.data);
      return true;
    }
  } catch (error) {
    console.error('Error loading cached analysis:', error);
  }
  
  return false;
}

// Analyze current page
async function analyzeCurrentPage() {
  if (!currentTab) {
    showError('Aktiv tab tapılmadı');
    return;
  }
  
  try {
    showLoading('Təhlil edilir...');
    
    const response = await browser.runtime.sendMessage({
      action: 'analyzeArticle',
      url: currentTab.url,
      modelType: 'auto'
    });
    
    if (response.success && response.data) {
      currentAnalysis = response.data;
      displayAnalysisResults(response.data);
    } else {
      showError(response.error || 'Təhlil uğursuz oldu');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    showError('Təhlil zamanı xəta baş verdi');
  }
}

// Retry analysis
async function retryAnalysis() {
  await analyzeCurrentPage();
}

// Display analysis results
function displayAnalysisResults(analysis) {
  hideAllStates();
  
  // Update article info
  document.getElementById('articleTitle').textContent = analysis.meta?.title || 'Məqalə';
  document.getElementById('articleUrl').textContent = analysis.meta?.url || currentTab.url;
  document.getElementById('articlePublication').textContent = analysis.meta?.publication || 'Naməlum nəşr';
  
  // Update scores
  if (analysis.scores) {
    const reliability = typeof analysis.scores.reliability === 'object' ? 
      (analysis.scores.reliability.value || analysis.scores.reliability.score || 0) : 
      (analysis.scores.reliability || 0);
    const bias = typeof analysis.scores.political_establishment_bias === 'object' ? 
      (analysis.scores.political_establishment_bias.value || analysis.scores.political_establishment_bias.score || 0) : 
      (analysis.scores.political_establishment_bias || 0);
    
    document.getElementById('reliabilityScore').textContent = `${reliability}%`;
    document.getElementById('biasScore').textContent = bias > 0 ? `+${bias}` : bias.toString();
    
    // Update progress bars
    const reliabilityBar = document.getElementById('reliabilityBar');
    if (reliabilityBar) {
      reliabilityBar.style.width = `${reliability}%`;
    }
    
    const biasDot = document.getElementById('biasDot');
    if (biasDot) {
      // Convert bias from -10 to +10 scale to 0-100% position
      const biasPercent = ((bias + 10) / 20) * 100;
      biasDot.style.left = `${Math.max(0, Math.min(100, biasPercent))}%`;
    }
  }
  
  // Update summary
  document.getElementById('summaryText').textContent = analysis.human_summary || analysis.summary || 'Təhlil nəticələri mövcud deyil';
  
  // Show results
  document.getElementById('analysisResults').style.display = 'block';
  
  // Update status
  const status = document.getElementById('status');
  status.textContent = 'Təhlil tamamlandı';
  status.className = 'status success';
}

// Open full analysis in new tab
function openFullAnalysis() {
  if (currentAnalysis && currentAnalysis.hash) {
    const fullAnalysisUrl = `https://lnk.az/analysis/${currentAnalysis.hash}`;
    browser.tabs.create({ url: fullAnalysisUrl });
  }
}

// Show loading state
function showLoading(message = 'Yüklənir...') {
  hideAllStates();
  document.getElementById('loadingState').style.display = 'block';
  
  const loadingText = document.querySelector('#loadingState p');
  if (loadingText) {
    loadingText.textContent = message;
  }
  
  const status = document.getElementById('status');
  status.textContent = 'Yüklənir';
  status.className = 'status analyzing';
}

// Show error state
function showError(message) {
  hideAllStates();
  document.getElementById('errorState').style.display = 'block';
  document.getElementById('errorMessage').textContent = message;
  
  const status = document.getElementById('status');
  status.textContent = 'Xəta';
  status.className = 'status error';
}

// Show no analysis state
function showNoAnalysis() {
  hideAllStates();
  document.getElementById('noAnalysis').style.display = 'block';
  
  const status = document.getElementById('status');
  status.textContent = 'Hazır';
  status.className = 'status';
}

// Hide all states
function hideAllStates() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('errorState').style.display = 'none';
  document.getElementById('analysisResults').style.display = 'none';
  document.getElementById('noAnalysis').style.display = 'none';
}

// Theme detection and switching
function initializeThemeDetection() {
  // Check for system theme preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  // Apply initial theme
  if (prefersLight) {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  } else if (prefersDark) {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
  }
  
  // Listen for theme changes
  const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  
  darkMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  });
  
  lightMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  });
  
  // Also check if the current website has a theme preference
  try {
    // Try to detect website theme from meta tags or body classes
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'getWebsiteTheme' }, (response) => {
          if (response && response.theme) {
            if (response.theme === 'light') {
              document.body.classList.add('theme-light');
              document.body.classList.remove('theme-dark');
            } else if (response.theme === 'dark') {
              document.body.classList.add('theme-dark');
              document.body.classList.remove('theme-light');
            }
          }
        });
      }
    });
  } catch (error) {
    // Ignore errors if content script is not available
    console.log('Could not detect website theme:', error);
  }
}