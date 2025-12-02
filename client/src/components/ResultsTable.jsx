// components/ResultsTable.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Download, CheckCircle, XCircle, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ResultsTable = ({ results }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    if (results.length === 0) return null;

    const handleDownload = () => {
        const csv = Papa.unparse(results.map(r => ({
            Prompt: r.prompt,
            Brand: r.brand,
            Mentioned: r.mentioned ? 'Yes' : 'No',
            Position: r.position || '-',
            Status: r.error ? 'Canned Response' : 'Normal'
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'brand_mentions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const mentionRate = ((results.filter(r => r.mentioned).length / results.length) * 100).toFixed(0);

    return (
        <div className="glass-card results-card">
            <div className="results-header">
                <div>
                    <h2 className="card-title">Analysis Results</h2>
                    <div className="mention-badge">
                        <TrendingUp size={16} />
                        {mentionRate}% Mention Rate
                    </div>
                </div>
                <button onClick={handleDownload} className="btn-secondary">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="table-wrapper">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Prompt & Brand</th>
                            <th>Status</th>
                            <th>Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    style={{ cursor: 'pointer', backgroundColor: result.error ? 'rgba(255, 193, 7, 0.05)' : 'transparent' }}
                                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                >
                                    <td>
                                        <div className="prompt-cell">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="brand-tag">{result.brand}</div>
                                                {result.error && (
                                                    <span style={{
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                        background: 'rgba(255, 193, 7, 0.2)',
                                                        border: '1px solid rgba(255, 193, 7, 0.5)',
                                                        borderRadius: '4px',
                                                        color: '#ffc107',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <AlertCircle size={12} />
                                                        Canned Response
                                                    </span>
                                                )}
                                            </div>
                                            <div className="prompt-text">{result.prompt}</div>
                                        </div>
                                    </td>
                                    <td>
                                        {result.mentioned ? (
                                            <span className="status-badge success">
                                                <CheckCircle size={18} />
                                                Mentioned
                                            </span>
                                        ) : (
                                            <span className="status-badge error">
                                                <XCircle size={18} />
                                                Not Found
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {result.position ? (
                                                <span className="position-badge">
                                                    #{result.position}
                                                </span>
                                            ) : (
                                                <span className="no-position">—</span>
                                            )}
                                            {expandedRow === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan="3" style={{
                                            padding: '20px',
                                            background: result.error ? 'rgba(255, 193, 7, 0.05)' : 'rgba(0,0,0,0.02)',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                lineHeight: '1.6',
                                                color: '#ccc',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                <strong style={{ display: 'block', marginBottom: '10px', color: '#fff' }}>
                                                    {result.error ? ' Canned Response:' : 'Response:'}
                                                </strong>
                                                {result.rawResponse}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsTable;
