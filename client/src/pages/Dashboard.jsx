import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import KpiStrip from '../components/KpiStrip';
import SummaryCard from '../components/SummaryCard';
import DataTable from '../components/DataTable';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import RegionBarChart from '../components/charts/RegionBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import InsightsPanel from '../components/InsightsPanel';
import api from '../api/axiosInstance';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [preview, setPreview] = useState([]);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, previewRes, chartsRes] = await Promise.all([
          api.get('/api/data/summary'),
          api.get('/api/data/preview'),
          api.get('/api/analytics/charts')
        ]);
        setSummary(summaryRes.data);
        setPreview(previewRes.data.rows);
        setCharts(chartsRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // No data yet - send to upload
          navigate('/upload');
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-loading">
          <div className="spinner"></div>
          <div style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="page-loading">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">

        {/* KPI Strip */}
        <section>
          <div className="section-title">📊 Key Performance Indicators</div>
          <KpiStrip kpis={charts?.kpis} />
        </section>

        {/* Summary Card */}
        <section>
          <div className="section-title">📋 Dataset Summary</div>
          <SummaryCard summary={summary} />
        </section>

        {/* Charts */}
        <section>
          <div className="section-title">📈 Interactive Charts</div>
          <div className="charts-grid">
            <SalesTrendChart data={charts?.trendData} />
            <RegionBarChart data={charts?.regionData} />
            <CategoryPieChart data={charts?.categoryData} />
          </div>
        </section>

        {/* AI Insights */}
        <section>
          <div className="section-title">✨ AI Insights</div>
          <InsightsPanel />
        </section>

        {/* Data Preview */}
        <section>
          <div className="section-title">
            🗃️ Data Preview
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              (first 15 rows)
            </span>
          </div>
          <DataTable rows={preview} />
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          AI-Powered Data Analyzer Dashboard
        </footer>

      </main>
    </>
  );
}
