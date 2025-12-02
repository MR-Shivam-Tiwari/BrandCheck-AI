# 🧪 How to Test Your Gemini API Key

## The Problem (Confirmed)

Your current API key test shows:
```
❌ API key has quota limit = 0
```

This means your API key is **NOT working** and needs to be replaced.

---

## ✅ Solution: Get a NEW API Key

### Step 1: Create New API Key

1. **Open** [Google AI Studio](https://aistudio.google.com/apikey)
2. **Sign in** with your Google account
3. **Delete** your old API key (if it exists)
4. Click **"Create API key"** → **"Create API key in new project"**
5. **Copy** the new API key immediately

### Step 2: Update Your `.env` File

```bash
cd /Users/shivamtiwari/Documents/Programming/assignment/server
nano .env
```

Replace the line:
```
GEMINI_API_KEY=AIzaSyD2K-brArLDpaJjTiBSYGFRK29Kb1RCfTo
```

With your new API key:
```
GEMINI_API_KEY=your_new_api_key_here
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

### Step 3: Restart Your Server

```bash
# Stop current server (Ctrl+C)
npm start
```

---

## 🧪 How to Test Your API Key

### Method 1: Using the Web UI (EASIEST)

1. **Start your frontend**:
   ```bash
   cd client
   npm run dev
   ```

2. **Open browser**: http://localhost:5173

3. **Click** the purple button: **"Test Gemini API Key"**

4. **See results**:
   - ✅ **SUCCESS** = API key is working!
   - ❌ **FAILED** = Follow the recommendation shown

### Method 2: Using Terminal (QUICK)

```bash
cd server
curl https://brand-check-ai-backend.vercel.app//api/test-gemini-key | jq
```

**Expected Output (Success):**
```json
{
  "finalStatus": "success",
  "workingModel": "gemini-1.5-flash",
  "recommendation": "✅ API key is working! Using model: gemini-1.5-flash"
}
```

**Current Output (Failed):**
```json
{
  "finalStatus": "failed",
  "recommendation": "❌ API key has quota limit = 0. Get a NEW API key from https://aistudio.google.com/apikey"
}
```

### Method 3: Using the Test Script

```bash
cd server
node test-full-flow.js
```

---

## 📊 What the Test Checks

The test endpoint automatically:

1. ✅ Checks if API key is present in `.env`
2. ✅ Shows first 20 characters of your API key
3. ✅ Tests 4 different Gemini models:
   - `gemini-1.5-flash` (fastest)
   - `gemini-1.5-pro` (most capable)
   - `gemini-2.0-flash-exp` (experimental)
   - `gemini-pro` (legacy)
4. ✅ Finds the first working model
5. ✅ Tells you exactly what's wrong if none work

---

## 🎯 Expected Results

### ✅ Working API Key
```
Status: SUCCESS
Recommendation: ✅ API key is working! Using model: gemini-1.5-flash
Working Model: gemini-1.5-flash
API Key: AIzaSyABC123...
```

### ❌ Quota Exceeded (Your Current Issue)
```
Status: FAILED
Recommendation: ❌ API key has quota limit = 0. Get a NEW API key from https://aistudio.google.com/apikey

Models Test:
- gemini-1.5-flash: Model not found
- gemini-1.5-pro: Model not found
- gemini-2.0-flash-exp: Quota exceeded (limit: 0)
- gemini-pro: Model not found
```

### ❌ Invalid API Key
```
Status: FAILED
Recommendation: ❌ Invalid API key. Check your GEMINI_API_KEY in .env file
```

---

## 🔄 After Getting New API Key

1. Update `.env` file with new key
2. Restart server (`npm start`)
3. Click "Test Gemini API Key" button in UI
4. Should see: **✅ SUCCESS**
5. Now you can test with:
   - Prompt: `Give a list of best marketing analytics tools`
   - Brand: `Matomo`

---

## 🆘 Still Not Working?

If you got a new API key and it still fails:

1. **Wait 1-2 minutes** - New keys need time to activate
2. **Check the key** - Make sure you copied it correctly
3. **Verify `.env` format**:
   ```
   GEMINI_API_KEY=AIzaSy...
   PORT=8000
   ```
   (No quotes, no spaces)
4. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   cd server
   npm start

   # In another terminal
   cd client
   npm run dev
   ```

---

## 📞 Quick Reference

**Test endpoint URL:**
- Local: `https://brand-check-ai-backend.vercel.app//api/test-gemini-key`
- Returns: JSON with detailed test results

**Frontend test button:**
- Purple button at top of form
- Shows visual results with color coding
- Expandable details for debugging

**Test script:**
- `node test-full-flow.js`
- Tests both sample cases from assignment
- Shows full responses

---

**Remember**: Your current API key has **quota limit = 0**. You MUST get a new one for the app to work!

Get new key here: **https://aistudio.google.com/apikey**
