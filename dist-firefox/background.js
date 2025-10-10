// Background script for LNK Media Bias Analyzer
// Handles API communication and data caching

// Cache for storing analysis results
const analysisCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Listen for messages from popup and content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeArticle') {
    analyzeArticle(request.url, request.modelType)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  } else if (request.action === 'getCachedAnalysis') {
    getCachedAnalysis(request.url)
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
        'User-Agent': 'LNK-Extension/1.0'
      },
      body: JSON.stringify({
        url: decodeURIComponent(url),
        modelType: modelType
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if response has the expected structure
    if (!data.scores && !data.meta) {
      console.error('API Error Details:', data);
      throw new Error(data.error || 'Invalid API response structure');
    }
    
    // Cache the result
    const analysisKey = `analysis_${encodeURIComponent(url)}`;
    const analysisData = {
      ...data,
      timestamp: Date.now(),
      url: url
    };
    
    analysisCache.set(analysisKey, analysisData);
    
    // Store in browser.storage for persistence
    try {
      await browser.storage.local.set({
        [analysisKey]: analysisData
      });
    } catch (storageError) {
      console.warn('Failed to store analysis in browser.storage:', storageError);
    }
    
    console.log('Analysis completed successfully');
    return analysisData;
    
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

// Get cached analysis if available and not expired
async function getCachedAnalysis(url) {
  const analysisKey = `analysis_${encodeURIComponent(url)}`;
  
  // Check memory cache first
  if (analysisCache.has(analysisKey)) {
    const analysis = analysisCache.get(analysisKey);
    if (Date.now() - analysis.timestamp < CACHE_EXPIRY) {
      return analysis;
    } else {
      analysisCache.delete(analysisKey);
    }
  }
  
  // Check browser.storage
  try {
    const result = await browser.storage.local.get(analysisKey);
    if (result[analysisKey]) {
      const analysis = result[analysisKey];
      if (Date.now() - analysis.timestamp < CACHE_EXPIRY) {
        // Update memory cache
        analysisCache.set(analysisKey, analysis);
        return analysis;
      } else {
        // Remove expired analysis
        await browser.storage.local.remove(analysisKey);
      }
    }
  } catch (storageError) {
    console.warn('Failed to read from browser.storage:', storageError);
  }
  
  return null;
}

// Clean up old analyses periodically
function cleanupOldAnalyses() {
  const now = Date.now();
  const keysToRemove = [];
  
  // Clean memory cache
  for (const [key, analysis] of analysisCache.entries()) {
    if (now - analysis.timestamp > CACHE_EXPIRY) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => analysisCache.delete(key));
  
  // Clean browser.storage
  browser.storage.local.get(null, (items) => {
    const keysToRemove = [];
    for (const [key, value] of Object.entries(items)) {
      if (key.startsWith('analysis_') && value.timestamp && now - value.timestamp > CACHE_EXPIRY) {
        keysToRemove.push(key);
      }
    }
    
    if (keysToRemove.length > 0) {
      browser.storage.local.remove(keysToRemove);
    }
  });
}

// Run cleanup every hour
setInterval(cleanupOldAnalyses, 60 * 60 * 1000);

// Initial cleanup on startup
cleanupOldAnalyses();