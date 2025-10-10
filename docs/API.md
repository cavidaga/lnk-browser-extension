# API Documentation

This document describes the API integration between the LNK Browser Extension and the LNK.az backend service.

## Overview

The extension communicates with the LNK.az API to analyze news articles and retrieve cached analysis results. All communication is done via HTTPS and follows RESTful principles.

## Base URL

- **Production**: `https://lnk.az`
- **Development**: `http://localhost:3000` (if running locally)

## Authentication

Currently, no authentication is required for the public API endpoints. Rate limiting is applied per IP address.

## Endpoints

### Analyze Article

Analyzes a news article for media bias and reliability.

**Endpoint**: `POST /api/analyze`

**Request Body**:
```json
{
  "url": "string",
  "modelType": "string"
}
```

**Parameters**:
- `url` (required): The URL of the article to analyze
- `modelType` (optional): Analysis model type (`auto`, `flash-lite`, `flash`, `pro`)

**Response**:
```json
{
  "hash": "string",
  "meta": {
    "title": "string",
    "publication": "string",
    "original_url": "string",
    "published_at": "string"
  },
  "scores": {
    "reliability": {
      "value": 0-100,
      "rationale": "string"
    },
    "political_establishment_bias": {
      "value": -5.0 to +5.0,
      "rationale": "string"
    }
  },
  "diagnostics": {
    "socio_cultural_descriptions": [
      {
        "group": "string",
        "stance": "string",
        "rationale": "string"
      }
    ],
    "language_flags": [
      {
        "term": "string",
        "category": "string",
        "evidence": "string"
      }
    ]
  },
  "cited_sources": [
    {
      "name": "string",
      "role": "string",
      "stance": "string"
    }
  ],
  "human_summary": "string",
  "is_advertisement": boolean,
  "advertisement_reason": "string",
  "warnings": [
    {
      "type": "string",
      "message": "string",
      "severity": "string"
    }
  ],
  "analyzed_at": "string",
  "modelUsed": "string",
  "contentSource": "string"
}
```

**Error Response**:
```json
{
  "error": true,
  "message": "string",
  "code": "string"
}
```

### Get Cached Analysis

Retrieves a previously cached analysis result.

**Endpoint**: `GET /api/get-analysis`

**Query Parameters**:
- `id` or `hash` (required): The analysis hash or ID

**Response**: Same as analyze article response

**Error Response**:
```json
{
  "error": true,
  "message": "Not found"
}
```

### Get Full Analysis Page

Redirects to the full analysis page on LNK.az.

**Endpoint**: `GET /analysis/:hash`

**Parameters**:
- `hash` (required): The analysis hash

**Response**: HTML page with full analysis details

## Rate Limiting

- **Rate Limit**: 10 requests per minute per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns HTTP 429 with error message

## Error Codes

| Code | Description |
|------|-------------|
| `BLOCKED_HOST` | The website is blocked by LNK policy |
| `BLOCKED_PATH` | The URL path is not allowed |
| `DISALLOWED_MIME` | Unsupported content type |
| `TOO_LARGE` | Content exceeds size limit |
| `NOT_FOUND` | Article not found (404/410) |
| `BUSY_TRY_AGAIN` | Analysis in progress, try again later |
| `POLICY` | General policy violation |

## Content Sources

The API may return different content sources:

- **Live**: Direct fetch from the original URL
- **LightFetch**: Lightweight fetch without full browser rendering
- **Archive.org**: Retrieved from Internet Archive
- **Archive.md**: Retrieved from archive.md service
- **Markdowner**: Processed through Markdowner service
- **Blocked**: Content was blocked by anti-bot protection

## Model Types

| Type | Description | Use Case |
|------|-------------|----------|
| `auto` | Automatic model selection | Default, recommended |
| `flash-lite` | Fast analysis for short news | Breaking news, short articles |
| `flash` | Balanced analysis | Regular news articles |
| `pro` | Deep analysis | Long-form articles, analysis pieces |

## Response Headers

| Header | Description |
|--------|-------------|
| `X-Model-Used` | The AI model used for analysis |
| `X-Content-Source` | The source of the analyzed content |
| `X-Schema-Version` | The analysis schema version |
| `X-Vercel-Cache` | Cache status (HIT/MISS) |

## Caching

- **Cache Duration**: 30 days (2,592,000 seconds)
- **Cache Key**: MD5 hash of URL + version
- **Storage**: Vercel KV (Redis-compatible)
- **Invalidation**: Manual or version-based

## Usage Examples

### JavaScript (Extension)

```javascript
// Analyze an article
const response = await fetch('https://lnk.az/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'LNK-Extension/1.0'
  },
  body: JSON.stringify({
    url: 'https://example.com/article',
    modelType: 'auto'
  })
});

const analysis = await response.json();

// Get cached analysis
const cachedResponse = await fetch(`https://lnk.az/api/get-analysis?id=${hash}`);
const cachedAnalysis = await cachedResponse.json();
```

### cURL

```bash
# Analyze an article
curl -X POST https://lnk.az/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article", "modelType": "auto"}'

# Get cached analysis
curl https://lnk.az/api/get-analysis?id=abc123
```

## Best Practices

1. **Always check for cached results first** before requesting new analysis
2. **Handle rate limiting gracefully** with exponential backoff
3. **Cache results locally** to reduce API calls
4. **Use appropriate model types** based on content length and complexity
5. **Handle errors gracefully** and provide user feedback
6. **Respect rate limits** to avoid being blocked

## Support

For API-related issues or questions:

- **GitHub Issues**: [Create an issue](https://github.com/cavidaga/lnk-browser-extension/issues)
- **LNK.az Support**: [Contact support](https://lnk.az/contact)
- **API Status**: Check [LNK.az status page](https://lnk.az/status)

---

For more information about the LNK.az platform, visit [https://lnk.az](https://lnk.az).
