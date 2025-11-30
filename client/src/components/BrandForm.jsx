// components/BrandForm.jsx
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const BrandForm = ({ onRun, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [brand, setBrand] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt && brand) {
            onRun(prompt, brand);
        }
    };

    return (
        <div className="glass-card">
            <div className="card-header">
                <h2 className="card-title">Check Brand Mention</h2>
                <p className="card-subtitle">Analyze AI responses for brand visibility</p>
            </div>
            
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="prompt" className="form-label">
                        Prompt
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Recommend the best CRM software for enterprise businesses"
                        className="form-textarea"
                        rows={4}
                        required
                    />
                    <p className="form-hint">
                        Enter the question or prompt you want to analyze
                    </p>
                </div>

                <div className="form-group">
                    <label htmlFor="brand" className="form-label">
                        Brand Name
                    </label>
                    <input
                        id="brand"
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g., Salesforce"
                        className="form-input"
                        required
                    />
                    <p className="form-hint">
                        Enter the brand name to check for mentions
                    </p>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Run Analysis
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default BrandForm;
