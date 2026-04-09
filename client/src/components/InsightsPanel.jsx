import { useState } from 'react';
import api from '../api/axiosInstance';

export default function InsightsPanel() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');
    setInsights('');
    try {
      const res = await api.post('/api/analytics/insights');
      setInsights(res.data.insights);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse **bold** markdown markers into JSX
  const renderInsights = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="glass-card insights-panel animate-fade-up">
      <div className="insights-header">
        <div className="insights-title">
          <span>✨</span>
          <span className="text-gradient">AI-Powered Insights</span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={generateInsights}
          disabled={loading}
          id="generate-insights-btn"
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
              Analysing...
            </>
          ) : (
            <>✨ Generate Insights</>
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="insights-content">
        {loading && (
          <div className="spinner-wrap">
            <div className="spinner"></div>
            <div className="spinner-text">Gemini is analysing your data...</div>
          </div>
        )}

        {!loading && !insights && !error && (
          <div className="insights-placeholder">
            <div className="insights-placeholder-icon">🧠</div>
            <div className="insights-placeholder-text">
              Click <strong style={{ color: 'var(--accent-purple)' }}>Generate Insights</strong> to get
              AI-powered analysis of your sales data
            </div>
          </div>
        )}

        {!loading && insights && (
          <div className="animate-fade-in" style={{ lineHeight: 1.8 }}>
            {renderInsights(insights)}
          </div>
        )}
      </div>
    </div>
  );
}
