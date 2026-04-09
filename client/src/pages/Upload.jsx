import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosInstance';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a CSV file first'); return; }
    setLoading(true);
    setError('');
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(res.data);
      // Auto-redirect to dashboard after 2s
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <Navbar />
      <div className="upload-content">
        <div className="glass-card upload-card animate-fade-up">
          <span className="upload-icon">📤</span>
          <h1 className="upload-title text-gradient">Upload Your Data</h1>
          <p className="upload-subtitle">
            Upload a CSV file to analyse your business data. Supported format: date, product, category,
            sales, units_sold, region, customer_age
          </p>

          {!success ? (
            <>
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="csv-file-input"
                />
                <div className="drop-icon">📁</div>
                <p className="drop-text">
                  <strong>Click to browse</strong> or drag & drop your CSV file here
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  Max file size: 10MB
                </p>
              </div>

              {file && (
                <div className="file-selected">
                  ✅ <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                </div>
              )}

              {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              {loading && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Processing your CSV...
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill"></div>
                  </div>
                </div>
              )}

              <button
                id="upload-btn"
                className="btn btn-primary btn-full btn-lg"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                    Uploading...
                  </>
                ) : '🚀 Upload & Analyse'}
              </button>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="alert alert-success" style={{ marginBottom: 20, justifyContent: 'center', fontSize: '1rem' }}>
                🎉 Upload successful!
              </div>
              <div className="summary-grid" style={{ background: 'rgba(16,185,129,0.05)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div className="summary-item">
                  <div className="summary-label">Rows Ingested</div>
                  <div className="summary-value">{success.rowCount?.toLocaleString()}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Columns</div>
                  <div className="summary-value">{success.columns?.length}</div>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
