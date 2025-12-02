// App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, BarChart3, Zap } from 'lucide-react';
import Navbar from './components/Navbar';
import BrandForm from './components/BrandForm';
import ResultsTable from './components/ResultsTable';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async (prompt, brand) => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://brand-check-ai-backend.vercel.app/api';
      const response = await axios.post(`${API_URL}/check-brand`, {
        prompt,
        brand
      });

      // Handle both success and backend-generated canned responses
      const newResult = {
        prompt,
        brand,
        mentioned: response.data.mentioned,
        position: response.data.position,
        rawResponse: response.data.rawResponse,
        error: response.data.error || false
      };

      setResults([newResult, ...results]);
    } catch (error) {
      console.error("Error checking brand:", error);

      // Frontend canned response when backend is completely unreachable
      const cannedResult = {
        prompt,
        brand,
        mentioned: false,
        position: null,
        rawResponse: "Service is currently unavailable. This is a canned response.",
        error: true
      };

      setResults([cannedResult, ...results]);

      // Show user-friendly notification (no intrusive alert)
      console.log("✅ App still working - showing canned response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />

      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <Sparkles size={16} />
              AI-Powered Brand Analytics
            </div>
            <h1 className="hero-title   ">
              Track Your Brand <span className="gradient-text">Visibility</span>
            </h1>
            <p className="hero-subtitle">
              Analyze AI-generated responses to see where your brand ranks in recommendations and mentions
            </p>
          </div>
        </div>
      </div>

      <div className="container main-content">
        <div className="grid">
          <div className="form-section">
            <BrandForm onRun={handleRun} isLoading={isLoading} />
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon primary">
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="stat-value">{results.length}</div>
                <div className="stat-label">Total Analyses</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <Zap size={24} />
              </div>
              <div>
                <div className="stat-value">
                  {results.filter(r => r.mentioned).length}
                </div>
                <div className="stat-label">Mentions Found</div>
              </div>
            </div>
          </div>
        </div>

        <ResultsTable results={results} />
      </div>
    </div>
  );
}

export default App;
