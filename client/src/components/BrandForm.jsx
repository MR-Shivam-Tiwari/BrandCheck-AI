// components/BrandForm.jsx
import React, { useState } from 'react';
import { Sparkles, TestTube } from 'lucide-react';
import axios from 'axios';

const BrandForm = ({ onRun, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [brand, setBrand] = useState('');
    const [testingKey, setTestingKey] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt && brand) {
            onRun(prompt, brand);
        }
    };

    const handleTestApiKey = async () => {
        setTestingKey(true);
        setTestResult(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const response = await axios.get(`${API_URL}/test-gemini-key`);
            setTestResult(response.data);
        } catch (error) {
            setTestResult({
                finalStatus: 'error',
                recommendation: error.response?.data?.recommendation || '❌ Failed to connect to server',
                error: error.message
            });
        } finally {
            setTestingKey(false);
        }
    };

    return (
        <div className="glass-card">
            <div className="card-header">
                <h2 className="card-title">Check Brand Mention</h2>
                <p className="card-subtitle">Analyze AI responses for brand visibility</p>
            </div>

            {/* API Key Test Section */}
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <button
                    type="button"
                    onClick={handleTestApiKey}
                    disabled={testingKey}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: testingKey ? '#666' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: testingKey ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    {testingKey ? (
                        <>
                            <span className="spinner"></span>
                            Testing API Key...
                        </>
                    ) : (
                        <>
                            <TestTube size={16} />
                            Test Gemini API Key
                        </>
                    )}
                </button>

                {testResult && (
                    <div style={{
                        marginTop: '15px',
                        padding: '15px',
                        background: testResult.finalStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${testResult.finalStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px', color: testResult.finalStatus === 'success' ? '#10b981' : '#ef4444' }}>
                            {testResult.finalStatus === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
                        </div>
                        <div style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                            {testResult.recommendation}
                        </div>
                        {testResult.workingModel && (
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                                Working Model: <strong>{testResult.workingModel}</strong>
                            </div>
                        )}
                        {testResult.apiKeyPreview && testResult.apiKeyPreview !== 'not set' && (
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                API Key: {testResult.apiKeyPreview}
                            </div>
                        )}
                        {testResult.modelsTest && testResult.modelsTest.length > 0 && (
                            <details style={{ marginTop: '10px', fontSize: '12px' }}>
                                <summary style={{ cursor: 'pointer', color: '#888' }}>View detailed test results</summary>
                                <div style={{ marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {testResult.modelsTest.map((test, idx) => (
                                        <div key={idx} style={{ padding: '8px', marginBottom: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                            <div><strong>{test.model}</strong></div>
                                            <div style={{ color: test.status === 'success' ? '#10b981' : '#ef4444' }}>
                                                Status: {test.status}
                                            </div>
                                            {test.errorType && <div>Error: {test.errorType}</div>}
                                            {test.response && <div>Response: {test.response}</div>}
                                            {test.responseTime && <div>Time: {test.responseTime}</div>}
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                )}
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
