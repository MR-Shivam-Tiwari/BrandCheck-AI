# Gemini Brand Mention Checker

A full-stack web application that checks if a specific brand is mentioned in a Gemini-generated response for a given prompt.

## 🚨 IMPORTANT: API Key Setup Required

**Before running the application**, you must set up a valid Gemini API key. See **[Quick Start](#-quick-start)** below.

## 🎯 AI Model Configuration

**Model**: `gemini-2.0-flash` (Fast, efficient, cost-effective model)
**Temperature**: `0.5` (Balanced for creativity and accuracy)
**Fuzzy Matching**: Enabled with 85% similarity threshold
**Error Handling**: Canned responses on API errors (app always works)

These settings are clearly configured at the top of `server/geminiService.js` (lines 4-14) for easy modification.

📖 **See CONFIGURATION.md for detailed configuration guide**

## ✨ Features
- **Brand Detection**: Checks if a brand is mentioned in the AI response using fuzzy matching
- **Fuzzy Matching**: Handles variations like "MailChimp" vs "Mailchimp" vs "mail chimp"
- **Position Tracking**: Identifies the position of the brand in list-based responses
- **CSV Export**: Download results to a CSV file
- **Premium UI**: Glassmorphism design with responsive layout
- **Error Handling**: Graceful degradation with canned responses on API failure
- **No Database**: Stateless design for easy deployment

## 🛠 Tech Stack
- **Frontend**: React (Vite), Axios, PapaParse, Lucide Icons
- **Backend**: Node.js, Express, Axios, Fuzzball (fuzzy matching)
- **AI**: Google Gemini API (`gemini-2.0-flash`) via REST API

## ⚡ Quick Start

### 1. Get Your Gemini API Key (Required!)
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Get API Key"** → **"Create API key in new project"**
3. Copy your new API key

### 2. Set Up Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your API key:
# GEMINI_API_KEY=your_key_here
# GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=your_key_here
```

### 3. Test API Connection
```bash
node test-full-flow.js
```
You should see:  All tests passed!

### 4. Start the Application
```bash
# Terminal 1 - Backend (Development with auto-reload)
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

**Note**: Use `npm run dev` for development (with nodemon auto-reload) or `npm start` for production.

### 5. Open Browser
Visit http://localhost:5173 and test with:
- **Prompt:** `Give a list of best marketing analytics tools`
- **Brand:** `Matomo`

---

## 📖 Detailed Setup & Running Locally

### Prerequisites
- Node.js installed
- Gemini API Key

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here

   # Optional: Full URL approach (recommended for better compatibility)
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=your_api_key_here

   PORT=8000
   ```

   **Note**: The application uses a REST API approach with the full URL method for maximum compatibility. If `GEMINI_API_URL` is not set, it will be constructed automatically from `GEMINI_API_KEY`.
4. Start the server:
    ```bash
    # Development mode (with auto-reload using nodemon)
    npm run dev
    
    # OR Production mode
    npm start
    ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **(Optional)** Create a `.env` file for custom API URL:
   ```bash
   cp .env.example .env
   # Edit .env if you want to use a different backend URL
   # VITE_API_URL=http://localhost:8000/api
   ```
   
   **Note**: The frontend has a fallback to `https://brand-check-ai-backend.vercel.app/api` if `VITE_API_URL` is not set. For local development, you may want to set it to `http://localhost:8000/api`.

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173 in your browser.

## 🚀 Deployment Instructions (Vercel - Both Frontend & Backend)

### Step 1: Deploy Backend to Vercel

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy Backend**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your repository
   - **Root Directory**: Set to `server`
   - **Environment Variables**: Add:
     - `GEMINI_API_KEY` - Your Gemini API key
     - `GEMINI_API_URL` - (Optional) Full URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY`
   - Click "Deploy"
   - Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend to Vercel

1. **Update Environment Variable**:
   - In Vercel Dashboard, import the same repository again
   - **Root Directory**: Set to `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add:
     - `VITE_API_URL` = `https://your-backend.vercel.app/api` (use your backend URL from Step 1)

2. Click "Deploy"

3. Your app will be live at `https://your-frontend.vercel.app`

### Alternative: Deploy on Render/Railway (Backend)

**Backend (Render/Railway)**:
- Build Command: `npm install`
- Start Command: `npm start` (runs `node index.js`)
- Root Directory: `server`
- Environment Variables:
  - `GEMINI_API_KEY` - Your Gemini API key (required)
  - `GEMINI_API_URL` - Full API endpoint (optional)
  - `PORT` - Server port (optional, default: 8000)

**Frontend (Vercel)**:
- Same as above, but update `VITE_API_URL` to your Render/Railway backend URL

## 🧪 Testing

### API Endpoints

The backend provides the following endpoints:

#### 1. **POST /api/check-brand** - Main brand checking endpoint
```bash
curl -X POST http://localhost:8000/api/check-brand \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give a list of best marketing analytics tools", "brand": "Matomo"}'
```

**Response:**
```json
{
  "mentioned": true,
  "position": 3,
  "rawResponse": "Here are some of the best marketing analytics tools...",
  "error": false
}
```

#### 2. **GET /api/test-api** - Simple API test
```bash
curl http://localhost:8000/api/test-api
```

**Response:**
```json
{
  "success": true,
  "message": "API is working!",
  "response": "Hello!"
}
```

#### 3. **GET /api/test-gemini-key** - Comprehensive API key validation
```bash
curl http://localhost:8000/api/test-gemini-key
```

**Response:**
```json
{
  "timestamp": "2024-12-02T07:52:00.000Z",
  "apiKeyStatus": "present",
  "apiKeyPreview": "AIzaSyB1234567890...",
  "modelsTest": [...],
  "finalStatus": "success",
  "workingModel": "gemini-2.0-flash",
  "recommendation": "✅ API key is working! Using model: gemini-2.0-flash"
}
```

### Test Cases (As per assignment requirements)

**Test Case 1**:
- Prompt: `"Give a list of best marketing analytics tools"`
- Brand: `"Matomo"`
- Expected: If mentioned → Yes, Position: 1, 2, 3, etc.

**Test Case 2**:
- Prompt: `"what are some good and cost effective email marketing platforms for small businesses"`
- Brand: `"mailchimp"`
- Expected: If mentioned → Yes, Position: 1, 2, 3, etc.

### Fuzzy Matching Tests
The app handles various brand name formats:
-  "MailChimp" matches "mailchimp"
-  "mail chimp" matches "MailChimp"
-  "Salesforce" matches "salesforce"
-  Works with 85%+ similarity threshold

## ⚙️ Configuration Details

### Core Settings
- **Model**: `gemini-2.0-flash` (Configured in `server/geminiService.js:7`)
- **Temperature**: `0.5` (Configured in `server/geminiService.js:10`)
- **Fuzzy Matching Threshold**: `85%` (Configured in `server/geminiService.js:13`)
- **Canned Response**: Active on all API errors (`server/geminiService.js:199-205`)

### API Implementation
This application uses **direct REST API calls** instead of the Google SDK for maximum compatibility:
- **Method**: HTTP POST requests via Axios
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Approach**: Full URL method with embedded API key for better reliability
- **Fallback**: If `GEMINI_API_URL` is not set in `.env`, it's constructed automatically from `GEMINI_API_KEY`

### Environment Variables
Required variables in `server/.env`:
- `GEMINI_API_KEY` - Your Gemini API key (required)
- `GEMINI_API_URL` - Full API endpoint URL (optional but recommended)
- `PORT` - Server port (default: 8000)

**All configuration is clearly documented at the top of geminiService.js for easy modification.**

📖 **For detailed configuration guide, see `server/CONFIGURATION.md`**

## 📁 Project Structure

```
assignment/
├── client/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrandForm.jsx      # Form for prompt and brand input
│   │   │   ├── ResultsTable.jsx   # Results display and CSV export
│   │   │   └── Navbar.jsx         # Navigation bar
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css                # Glassmorphism styles
│   │   └── main.jsx               # Entry point
│   ├── .env                       # Environment variables (local, gitignored)
│   ├── .env.example               # Environment template
│   ├── vite.config.js             # Vite configuration
│   └── package.json               # Frontend dependencies
│
├── server/                        # Backend (Node.js + Express)
│   ├── index.js                   # Express server setup
│   ├── routes.js                  # API routes (/check-brand, /test-api, /test-gemini-key)
│   ├── geminiService.js           # Gemini API integration + fuzzy matching
│   ├── vercel.json                # Vercel deployment config
│   ├── CONFIGURATION.md           # Detailed configuration guide
│   ├── .env                       # Environment variables (local, gitignored)
│   ├── .env.example               # Environment template
│   ├── package.json               # Backend dependencies (includes nodemon)
│   │
│   ├── Test & Utility Scripts:
│   ├── test-api.js                # Simple API test
│   ├── test-full-flow.js          # Complete end-to-end test
│   ├── diagnose-api.js            # Comprehensive API diagnostics
│   ├── quick-test.js              # Quick API verification
│   ├── setup-api-key.js           # Interactive API key setup
│   ├── verify-requirements.js     # Verify all requirements met
│   ├── list-models.js             # List available Gemini models
│   └── update-api-key.sh          # Shell script to update API key
│
└── README.md                      # This file
```

## 🔐 Security Notes

-  API key stored as server environment variable
-  Never exposed in browser/frontend code
-  CORS enabled for cross-origin requests
-  Error handling prevents API key leakage

## 📊 Scoring Checklist

-  Live link works (after Vercel deployment)
-  Form accepts inputs and runs
-  Exact matches work
-  Fuzzy matches work (85% threshold with fuzzball library)
-  CSV download works (using PapaParse)
-  Errors show clear message and app still works (canned responses)
-  Model name (`gemini-2.0-flash`) and temperature (`0.5`) fixed and mentioned in README
-  UI is simple and readable (glassmorphism design)
-  API efficiency (stateless, no database, serverless-ready)
-  Choice of logic: Fuzzy matching with multi-pattern detection for brand variations

## 🆘 Troubleshooting

**Issue**: "Service is currently unavailable" error
- **Cause**: Invalid or expired API key, or quota limit reached
- **Solution**:
  1. Get a **NEW** API key from [Google AI Studio](https://aistudio.google.com/apikey)
  2. Update your `.env` file with the new key
  3. Run `node test-full-flow.js` to verify
  4. See `server/SETUP_GUIDE.md` for detailed instructions

**Issue**: API Key has quota limit = 0
- **Solution**: Delete your old API key and create a completely new one in Google AI Studio

**Issue**: 404 errors for gemini-pro or other models
- **Solution**: Already fixed! We now use `gemini-2.0-flash` with direct REST API calls (updated in `server/geminiService.js`)

**Issue**: Frontend can't connect to backend
- **Solution**: Ensure `VITE_API_URL` environment variable is set correctly in Vercel

**Issue**: Extra quotes in payload (e.g., `"mailchimp"` instead of `mailchimp`)
- **Solution**: Already fixed! Backend now strips quotes automatically (`server/routes.js:31-32`)

**Issue**: CSV download not working
- **Solution**: Check browser console for errors, ensure results table has data

**Issue**: Fuzzy matching too strict/loose
- **Solution**: Adjust `FUZZY_THRESHOLD` in `server/geminiService.js:32` (currently 85%)

### Helpful Commands
```bash
# Navigate to server directory first
cd server

# Test your API key (simple)
node test-api.js

# Run full test suite (comprehensive)
node test-full-flow.js

# Diagnose API issues
node diagnose-api.js

# Quick API verification
node quick-test.js

# Verify all requirements
node verify-requirements.js

# Interactive API key setup
node setup-api-key.js

# Update API key via shell script
./update-api-key.sh

# List available Gemini models
node list-models.js

# Check current API key (first 20 chars)
cat .env | grep GEMINI_API_KEY
```

## 📝 License

This project is created for assignment purposes.

---

**Built with ❤️ using React, Node.js, and Google Gemini AI**
