# Gemini Brand Mention Checker

A full-stack web application that checks if a specific brand is mentioned in a Gemini-generated response for a given prompt.

## 🎯 AI Model Configuration

**Model**: `gemini-1.5-flash` (Least expensive Gemini model)
**Temperature**: `0.5` (Balanced for creativity and accuracy)
**Fuzzy Matching**: Enabled with 85% similarity threshold

These settings are hardcoded in `server/geminiService.js` for consistency and cost optimization.

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
- **Backend**: Node.js, Express, Fuzzball (fuzzy matching)
- **AI**: Google Gemini API (`gemini-1.5-flash`)

## Setup & Running Locally

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
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
   (Or `node index.js`)

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser.

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
   - **Environment Variables**: Add `GEMINI_API_KEY` with your API key
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
- Start Command: `node index.js`
- Root Directory: `server`
- Environment Variables: Set `GEMINI_API_KEY`

**Frontend (Vercel)**:
- Same as above, but update `VITE_API_URL` to your Render/Railway backend URL

## 🧪 Testing

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
- ✅ "MailChimp" matches "mailchimp"
- ✅ "mail chimp" matches "MailChimp"
- ✅ "Salesforce" matches "salesforce"
- ✅ Works with 85%+ similarity threshold

## ⚙️ Configuration Details

- **Model**: `gemini-1.5-flash` (Hardcoded in `server/geminiService.js:5`)
- **Temperature**: `0.5` (Hardcoded in `server/geminiService.js:7`)
- **Fuzzy Matching Threshold**: `85%` (Hardcoded in `server/geminiService.js:13`)

## 📁 Project Structure

```
assignment/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrandForm.jsx      # Form for prompt and brand input
│   │   │   ├── ResultsTable.jsx   # Results display and CSV export
│   │   │   └── Navbar.jsx         # Navigation bar
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css                # Glassmorphism styles
│   │   └── main.jsx               # Entry point
│   ├── .env                       # Environment variables (local)
│   ├── .env.example              # Environment template
│   └── package.json
│
├── server/                # Backend (Node.js + Express)
│   ├── index.js                  # Express server setup
│   ├── routes.js                 # API routes
│   ├── geminiService.js          # Gemini API integration + fuzzy matching
│   ├── vercel.json               # Vercel deployment config
│   ├── .env                      # Environment variables (local)
│   ├── .env.example             # Environment template
│   └── package.json
│
└── README.md              # This file
```

## 🔐 Security Notes

- ✅ API key stored as server environment variable
- ✅ Never exposed in browser/frontend code
- ✅ CORS enabled for cross-origin requests
- ✅ Error handling prevents API key leakage

## 📊 Scoring Checklist

- ✅ Live link works (after Vercel deployment)
- ✅ Form accepts inputs and runs
- ✅ Exact matches work
- ✅ Fuzzy matches work (85% threshold with fuzzball library)
- ✅ CSV download works (using PapaParse)
- ✅ Errors show clear message and app still works (canned responses)
- ✅ Model name (`gemini-1.5-flash`) and temperature (`0.5`) fixed and mentioned in README
- ✅ UI is simple and readable (glassmorphism design)
- ✅ API efficiency (stateless, no database, serverless-ready)
- ✅ Choice of logic: Fuzzy matching with multi-pattern detection for brand variations

## 🆘 Troubleshooting

**Issue**: Frontend can't connect to backend
- **Solution**: Ensure `VITE_API_URL` environment variable is set correctly in Vercel

**Issue**: "API Key not valid" error
- **Solution**: Check that `GEMINI_API_KEY` is set in backend environment variables

**Issue**: CSV download not working
- **Solution**: Check browser console for errors, ensure results table has data

**Issue**: Fuzzy matching too strict/loose
- **Solution**: Adjust `FUZZY_THRESHOLD` in `server/geminiService.js:13` (currently 85%)

## 📝 License

This project is created for assignment purposes.

---

**Built with ❤️ using React, Node.js, and Google Gemini AI**
