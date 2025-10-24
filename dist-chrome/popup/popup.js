// Popup script for LNK Media Bias Analyzer
// Handles user interactions and displays analysis results

let currentTab = null;
let currentAnalysis = null;

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get current active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];
    
    if (!currentTab) {
      showError('Aktiv tab tapılmadı');
      return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Show brief loading state while checking for cached analysis
    showLoading('Keş yoxlanılır...');
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Always try to load cached analysis first, regardless of page type
    const hasCachedAnalysis = await loadCachedAnalysis();
    
    // If no cached analysis, check if current page is analyzable
    if (!hasCachedAnalysis) {
      try {
        const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'getArticleInfo' });
        
        if (response && response.isNewsArticle) {
          showNoAnalysis();
        } else {
          showNoAnalysis();
        }
      } catch (error) {
        // Could not check if page is news article, show no analysis state
        showNoAnalysis();
      }
    }
  } catch (error) {
    // Popup initialization error
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
    const response = await chrome.runtime.sendMessage({
      action: 'getCachedAnalysis',
      url: currentTab.url
    });
    
    if (response.success && response.data) {
      currentAnalysis = response.data;
      displayAnalysisResults(response.data);
      return true; // Cached analysis found and displayed
    } else {
      return false; // No cached analysis found
    }
  } catch (error) {
    // Error loading cached analysis
    return false; // Error occurred, no cached analysis
  }
}

// Analyze current page
async function analyzeCurrentPage() {
  if (!currentTab) return;
  
  try {
    showLoading('Təhlil edilir...');
    
    const response = await chrome.runtime.sendMessage({
      action: 'analyzeArticle',
      url: currentTab.url,
      modelType: 'auto'
    });
    
    if (response.success) {
      currentAnalysis = response.data;
      displayAnalysisResults(response.data);
    } else {
      showError(response.error || 'Təhlil zamanı xəta baş verdi');
    }
  } catch (error) {
    // Analysis error
    showError(`Təhlil zamanı xəta baş verdi: ${error.message}`);
  }
}

// Retry analysis
async function retryAnalysis() {
  await analyzeCurrentPage();
}

// Display analysis results
function displayAnalysisResults(analysis) {
  hideAllStates();
  
  // Update status
  const status = document.getElementById('status');
  status.textContent = 'Təhlil edildi';
  status.className = 'status success';
  
  // Show results
  const resultsDiv = document.getElementById('analysisResults');
  resultsDiv.style.display = 'block';
  
  // Update article info
  document.getElementById('articleTitle').textContent = analysis.meta?.title || 'Başlıq yoxdur';
  document.getElementById('articleUrl').textContent = analysis.meta?.original_url || currentTab.url;
  document.getElementById('articlePublication').textContent = analysis.meta?.publication || 'Naməlum';
  
  // Update scores - handle both old and new data structures
  const reliability = typeof analysis.scores?.reliability === 'object' 
    ? analysis.scores.reliability.value || analysis.scores.reliability.score || 0
    : analysis.scores?.reliability || 0;
    
  const bias = typeof analysis.scores?.political_establishment_bias === 'object'
    ? analysis.scores.political_establishment_bias.value || analysis.scores.political_establishment_bias.score || 0
    : analysis.scores?.political_establishment_bias || 0;
  
  document.getElementById('reliabilityScore').textContent = `${Math.round(reliability)}/100`;
  document.getElementById('biasScore').textContent = formatBiasScore(bias);
  
  // Update reliability bar
  const reliabilityBar = document.getElementById('reliabilityBar');
  reliabilityBar.style.width = `${reliability}%`;
  
  // Update bias indicator
  const biasDot = document.querySelector('.bias-dot');
  const biasPosition = ((bias + 5) / 10) * 100; // Convert -5 to +5 range to 0-100%
  biasDot.style.left = `calc(${biasPosition}% - 6px)`;
  
  // Update bias dot color based on value
  if (bias > 2) {
    biasDot.style.background = '#ef4444'; // Red for strong pro-establishment
  } else if (bias > 0) {
    biasDot.style.background = '#f59e0b'; // Orange for moderate pro-establishment
  } else if (bias < -2) {
    biasDot.style.background = '#3b82f6'; // Blue for strong opposition
  } else if (bias < 0) {
    biasDot.style.background = '#8b5cf6'; // Purple for moderate opposition
  } else {
    biasDot.style.background = '#6b7280'; // Gray for neutral
  }
  
  // Update summary
  const summaryText = analysis.human_summary || 'Xülasə mövcud deyil';
  document.getElementById('summaryText').textContent = summaryText;
  
  // Show warnings if any
  if (analysis.warnings && analysis.warnings.length > 0) {
    showWarnings(analysis.warnings);
  }
}

// Format bias score for display
function formatBiasScore(bias) {
  if (bias > 0) {
    return `+${bias.toFixed(1)}`;
  } else if (bias < 0) {
    return bias.toFixed(1);
  } else {
    return '0.0';
  }
}

// Show warnings
function showWarnings(warnings) {
  const summarySection = document.querySelector('.summary-section');
  const warningsDiv = document.createElement('div');
  warningsDiv.className = 'warnings-section';
  warningsDiv.innerHTML = `
    <h4 style="color: #f59e0b; margin-bottom: 8px;">⚠️ Xəbərdarlıq</h4>
    ${warnings.map(warning => `
      <div style="
        background: #451a03;
        border: 1px solid #f59e0b;
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 8px;
        font-size: 12px;
        color: #fbbf24;
      ">
        <strong>${getWarningTitle(warning.type)}:</strong> ${warning.message}
      </div>
    `).join('')}
  `;
  
  summarySection.appendChild(warningsDiv);
}

// Get warning title based on type
function getWarningTitle(type) {
  const titles = {
    'content_blocked': 'Mənbə bloklanıb',
    'archived_content': 'Arxiv məlumatı',
    'limited_content': 'Məhdud məzmun'
  };
  return titles[type] || 'Xəbərdarlıq';
}

// Open full analysis in new tab
function openFullAnalysis() {
  if (currentAnalysis && currentAnalysis.hash) {
    const fullAnalysisUrl = `https://lnk.az/analysis/${encodeURIComponent(currentAnalysis.hash)}`;
    chrome.tabs.create({ url: fullAnalysisUrl });
  }
}

// Show loading state
function showLoading(message = 'Yüklənir...') {
  hideAllStates();
  document.getElementById('loadingState').style.display = 'block';
  
  // Update loading message
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

// Functions are now handled via event listeners, no need for global exposure
