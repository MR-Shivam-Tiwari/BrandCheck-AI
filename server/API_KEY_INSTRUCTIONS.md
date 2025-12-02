# How to Get a Valid Gemini API Key

## Step 1: Go to Google AI Studio

Visit: **https://aistudio.google.com/apikey**

## Step 2: Sign in with Google Account

- Use your Google account to sign in
- Accept the terms of service if prompted

## Step 3: Create API Key

1. Click on **"Get API key"** or **"Create API key"**
2. You may need to create a project first (it will prompt you)
3. Click **"Create API key in new project"** or select an existing project
4. Copy the generated API key (it will look like: `AIza...`)

## Step 4: Update Your .env File

1. Open `/server/.env` file
2. Replace the old key with your new key:

```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
PORT=6000
```

## Step 5: Test the API

Run this command from the server directory:

```bash
node test-api.js
```

You should see: ✅ SUCCESS!

## Common Issues:

### ❌ API Key Invalid
- Make sure you copied the entire key
- No extra spaces before/after the key
- The key should start with `AIza`

### ❌ 404 Model Not Found
- Some API keys may not have access to certain models
- Try different model names (the test script will find one that works)

### ❌ Quota Exceeded
- Free tier has limited requests per minute
- Wait a few minutes and try again
- Or upgrade to a paid plan

## Need Help?

- Visit: https://ai.google.dev/tutorials/get_started_node
- Or check: https://ai.google.dev/gemini-api/docs
