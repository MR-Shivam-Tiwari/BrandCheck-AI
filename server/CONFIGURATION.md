# 🎯 Gemini API Configuration

## Model Configuration

### Current Model: **gemini-2.0-flash**
- **Why this model?** Fast, efficient, and available with current API key
- **Cost:** One of the most cost-effective models currently available
- **Performance:** Excellent balance of speed and quality
- **Availability:** ✅ Working with current API key

### Temperature: **0.5**
- **Purpose:** Balanced for creativity and accuracy
- **Range:** 0.0 (deterministic) to 1.0 (creative)
- **Location:** `server/geminiService.js` line 10

---

## Configuration Location

All settings are clearly defined at the top of `geminiService.js`:

```javascript
// ===== CONFIGURATION =====
// Model: gemini-2.0-flash (Fast, efficient, and available with current API key)
const GEMINI_MODEL = 'gemini-2.0-flash';

// Temperature: 0.5 (Balanced for creativity and accuracy)
const TEMPERATURE = 0.5;

// Fuzzy matching threshold (85% similarity)
const FUZZY_THRESHOLD = 85;
// =========================
```

**File:** `server/geminiService.js` (lines 4-14)

---

## Error Handling

### Canned Response (Always Active) ✅

When API errors occur, the application returns a canned response so it continues working:

```javascript
{
  "mentioned": false,
  "position": null,
  "rawResponse": "Service is currently unavailable. This is a canned response.",
  "error": true
}
```

**Location:** `server/geminiService.js` lines 199-205

### Error Scenarios Covered:
- ✅ API key invalid
- ✅ Rate limit exceeded
- ✅ Network timeout
- ✅ Model not available
- ✅ Invalid response format
- ✅ Any unexpected error

---

## API Endpoint

### Full URL (Environment Variable)
```bash
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
```

### Request Payload
```json
{
  "contents": [{
    "parts": [{ "text": "user prompt here" }]
  }],
  "generationConfig": {
    "temperature": 0.5,
    "maxOutputTokens": 2048
  }
}
```

---

## How to Change Configuration

### Change Model:
Edit `server/geminiService.js` line 7:
```javascript
const GEMINI_MODEL = 'gemini-2.0-flash';  // Change this
```

Available models (if accessible with your API key):
- `gemini-2.0-flash` ✅ (Current - working)
- `gemini-1.5-flash` ❌ (Not available with current key)
- `gemini-1.5-pro` ❌ (Not available with current key)

### Change Temperature:
Edit `server/geminiService.js` line 10:
```javascript
const TEMPERATURE = 0.5;  // Change this (0.0 to 1.0)
```

**Temperature Guidelines:**
- `0.0-0.3`: More focused, deterministic outputs
- `0.4-0.6`: Balanced (recommended)
- `0.7-1.0`: More creative, varied outputs

### Change Fuzzy Matching Threshold:
Edit `server/geminiService.js` line 13:
```javascript
const FUZZY_THRESHOLD = 85;  // Change this (0 to 100)
```

**Threshold Guidelines:**
- `90-100`: Very strict matching
- `80-90`: Balanced (recommended)
- `70-80`: More lenient matching

---

## Testing Configuration

### Test API with current settings:
```bash
cd server
node -e "
const { checkBrandMention } = require('./geminiService');
checkBrandMention('Say hello', 'test').then(r => console.log(r));
"
```

### Test canned response (simulate error):
```bash
# Temporarily change API key to invalid one in .env
# Then run any test - should see canned response
```

---

## Verification Checklist

✅ **Model:** gemini-2.0-flash
✅ **Temperature:** 0.5
✅ **Canned Response:** Active on all errors
✅ **Configuration:** Clearly documented at top of file
✅ **API Key:** Working from react-ai-tool
✅ **Error Handling:** Comprehensive

---

## Performance Metrics (From Tests)

**Test 1: Simple Query**
- Model: gemini-2.0-flash
- Response Time: ~2-3 seconds
- Response Length: ~40 characters
- Status: ✅ SUCCESS

**Test 2: Marketing Tools List**
- Model: gemini-2.0-flash
- Response Time: ~3-4 seconds
- Response Length: ~7,500 characters
- Status: ✅ SUCCESS
- Brand Detection: ✅ Working

**Test 3: Error Simulation**
- Invalid Model: gemini-1.5-flash
- Canned Response: ✅ Returned correctly
- App Continued: ✅ No crash

---

## Cost Optimization

### Current Setup (Optimized)
- **Model:** gemini-2.0-flash (cost-effective)
- **Temperature:** 0.5 (balanced, no waste)
- **Max Tokens:** 2048 (reasonable limit)
- **Timeout:** 30 seconds (prevents hanging)

### Why gemini-2.0-flash?
1. ✅ Available with current API key
2. ✅ Fast response times
3. ✅ Good quality outputs
4. ✅ Cost-effective pricing
5. ✅ Reliable availability

---

## Summary

Your application is configured with:
- ✅ **Best available model** for current API key
- ✅ **Optimal temperature** for balanced outputs
- ✅ **Robust error handling** with canned responses
- ✅ **Clear configuration** that's easy to modify
- ✅ **All existing features** preserved

**The app will always work, even if API fails!** 🎉

---

Last Updated: December 2, 2025
Configuration Version: 1.0
Status: ✅ Production Ready
