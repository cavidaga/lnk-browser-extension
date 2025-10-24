// Background script for LNK Media Bias Analyzer
// Handles API calls and communication between content script and popup

chrome.runtime.onInstalled.addListener(() => {
  console.log('LNK Media Bias Analyzer extension installed');
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeArticle') {
    analyzeArticle(request.url, request.modelType)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  } else if (request.action === 'openPopup') {
    // Note: chrome.action.openPopup() is not available in service workers
    console.log('Popup open requested - not available in service worker');
  } else if (request.action === 'getCachedAnalysis') {
    getCachedAnalysis(request.url)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (request.action === 'getRecentAnalyses') {
    getRecentAnalyses()
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (request.action === 'getAnalysisByHash') {
    getAnalysisByHash(request.hash)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Analyze article using LNK.az API
async function analyzeArticle(url, modelType = 'auto') {
  try {
    console.log(`Analyzing article: ${url}`);
    
    const response = await fetch('https://lnk.az/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LNK-Extension/2.0'
      },
      body: JSON.stringify({
        url: decodeURIComponent(url),
        modelType: modelType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if response has the expected structure
    if (!data.scores && !data.meta) {
      console.error('API Error Details:', data);
      throw new Error(data.error || 'Invalid API response structure');
    }
    
    // Store analysis result in chrome storage
    const analysisKey = `analysis_${encodeURIComponent(url)}`;
    const analysisData = {
      ...data,
      analyzedAt: new Date().toISOString(),
      url: url
    };
    
    await chrome.storage.local.set({
      [analysisKey]: analysisData
    });

    // Update recent analyses list
    const recentKey = 'recent_analyses';
    const recent = await chrome.storage.local.get([recentKey]);
    const recentAnalyses = recent[recentKey] || [];
    
    // Add to beginning of list
    recentAnalyses.unshift({
      url: url,
      title: data.meta?.title || 'Untitled',
      publication: data.meta?.publication || '',
      reliability: data.scores?.reliability?.value || 0,
      politicalBias: data.scores?.political_establishment_bias?.value || 0,
      analyzedAt: new Date().toISOString(),
      hash: data.hash
    });
    
    // Keep only last 50 analyses
    recentAnalyses.splice(50);
    
    await chrome.storage.local.set({ [recentKey]: recentAnalyses });

    return analysisData;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

// Get cached analysis if available
async function getCachedAnalysis(url) {
  try {
    const analysisKey = `analysis_${encodeURIComponent(url)}`;
    const result = await chrome.storage.local.get([analysisKey]);
    return result[analysisKey] || null;
  } catch (error) {
    console.error('Error getting cached analysis:', error);
    return null;
  }
}

// Get recent analyses
async function getRecentAnalyses() {
  try {
    const result = await chrome.storage.local.get(['recent_analyses']);
    return result.recent_analyses || [];
  } catch (error) {
    console.error('Error getting recent analyses:', error);
    return [];
  }
}

// Get analysis by hash from API
async function getAnalysisByHash(hash) {
  try {
    console.log(`Fetching analysis by hash: ${hash}`);
    
    const response = await fetch(`https://lnk.az/api/get-analysis?id=${encodeURIComponent(hash)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'LNK-Extension/2.0'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Analysis not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Analysis fetched by hash:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching analysis by hash:', error);
    throw error;
  }
}

// Clear old analyses (older than 30 days)
async function cleanupOldAnalyses() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const allData = await chrome.storage.local.get();
    const keysToRemove = [];
    
    for (const [key, value] of Object.entries(allData)) {
      if (key.startsWith('analysis_') && value.analyzedAt) {
        const analyzedAt = new Date(value.analyzedAt);
        if (analyzedAt < thirtyDaysAgo) {
          keysToRemove.push(key);
        }
      }
    }
    
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
      console.log(`Cleaned up ${keysToRemove.length} old analyses`);
    }
  } catch (error) {
    console.error('Error cleaning up old analyses:', error);
  }
}

// Run cleanup on startup (only available in persistent background pages)
// chrome.runtime.onStartup.addListener(cleanupOldAnalyses);