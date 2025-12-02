# 🔧 Gemini API Setup Guide

## Issue Summary
Your current API key has **quota limit = 0**, which means it's not properly activated.

## ✅ Solution: Get a Fresh API Key

### Step 1: Get New API Key
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. **Sign in** with your Google account
3. Click **"Get API Key"**
4. Click **"Create API key in new project"** (recommended)
5. **Copy** the new API key

### Step 2: Update Your .env File
Replace your current API key with the new one:

```bash
cd /Users/shivamtiwari/Documents/Programming/assignment/server
```

Then either:
- **Option A:** Manually edit `.env` file and replace the API key
- **Option B:** Run the update script:
  ```bash
  ./update-api-key.sh
  ```

### Step 3: Test the API Key
```bash
cd /Users/shivamtiwari/Documents/Programming/assignment/server
node test-api.js
```

You should see:
```
✅ API Key is loaded
✅ API client initialized
✅ SUCCESS with model: gemini-1.5-flash
```

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Test the Full Application
Open your browser and test with:
- **Prompt:** `Give a list of best marketing analytics tools`
- **Brand:** `Matomo`

---

## 🐛 What I Fixed

### 1. Updated Model Name
Changed from deprecated `gemini-pro` to `gemini-1.5-flash`

**File:** `server/geminiService.js:22`

### 2. Input Sanitization
Added logic to remove extra quotes from user input

**File:** `server/routes.js:31-32`

Now handles inputs like:
- `"mailchimp"` → `mailchimp` ✅
- `"what are some..."` → `what are some...` ✅

---

## 📝 Test Cases

Once your API key is working, test with these:

### Test 1
```
Prompt: Give a list of best marketing analytics tools
Brand: Matomo
Expected: mentioned = true/false, position = 1,2,3... (if mentioned)
```

### Test 2
```
Prompt: what are some good and cost effective email marketing platforms for small businesses
Brand: mailchimp
Expected: mentioned = true/false, position = 1,2,3... (if mentioned)
```

---

## 🚨 Troubleshooting

### If you still get errors:

1. **Check API key is correct:**
   ```bash
   cat .env | grep GEMINI_API_KEY
   ```

2. **Test specific models:**
   ```bash
   node -e "
   require('dotenv').config();
   const { GoogleGenerativeAI } = require('@google/generative-ai');

   async function test() {
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
     const result = await model.generateContent('Say hello');
     const response = await result.response;
     console.log('✅ Success:', response.text());
   }
   test();
   "
   ```

3. **Check if you're hitting rate limits:**
   - Free tier: 15 requests per minute
   - If exceeded, wait 1 minute and try again

4. **Verify API is enabled:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable "Generative Language API"

---

## 📊 Expected API Response Format

When working correctly, the API returns:

```json
{
  "mentioned": true,
  "position": 2,
  "rawResponse": "Here are the best CRM software options:\n\n1. HubSpot...\n2. Salesforce..."
}
```

Or if service fails:
```json
{
  "mentioned": false,
  "position": null,
  "rawResponse": "Service is currently unavailable. This is a canned response.",
  "error": true
}
```

---

## 🎯 Next Steps

1. ✅ Get new API key from Google AI Studio
2. ✅ Update `.env` file
3. ✅ Run `node test-api.js` to verify
4. ✅ Start server with `npm start`
5. ✅ Test the application with sample data

---

Need help? Check:
- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
