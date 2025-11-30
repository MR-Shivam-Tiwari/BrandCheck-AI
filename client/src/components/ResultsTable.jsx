// components/ResultsTable.jsx
import React from 'react';
import Papa from 'papaparse';
import { Download, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const ResultsTable = ({ results }) => {
    if (results.length === 0) return null;

    const handleDownload = () => {
        const csv = Papa.unparse(results.map(r => ({
            Prompt: r.prompt,
            Brand: r.brand,
            Mentioned: r.mentioned ? 'Yes' : 'No',
            Position: r.position || '-'
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
                            <tr key={index}>
                                <td>
                                    <div className="prompt-cell">
                                        <div className="brand-tag">{result.brand}</div>
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
                                    {result.position ? (
                                        <span className="position-badge">
                                            #{result.position}
                                        </span>
                                    ) : (
                                        <span className="no-position">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsTable;
