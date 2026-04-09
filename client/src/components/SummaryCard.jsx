export default function SummaryCard({ summary }) {
  if (!summary) return null;

  const { totalRows, dateRange, uniqueCategories, uniqueRegions, uniqueProducts, filename } = summary;

  return (
    <div className="glass-card animate-fade-up">
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-label">📁 File</div>
          <div className="summary-value" style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{filename}</div>
        </div>

        <div className="summary-item">
          <div className="summary-label">🗃️ Total Rows</div>
          <div className="summary-value">{totalRows?.toLocaleString()}</div>
        </div>

        <div className="summary-item">
          <div className="summary-label">📅 Date Range</div>
          <div className="summary-value" style={{ fontSize: '0.88rem' }}>
            {dateRange ? `${dateRange.from} → ${dateRange.to}` : 'N/A'}
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-label">🏷️ Categories</div>
          <div className="summary-tags">
            {uniqueCategories?.map((c) => <span key={c} className="tag">{c}</span>)}
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-label">🌍 Regions</div>
          <div className="summary-tags">
            {uniqueRegions?.map((r) => <span key={r} className="tag">{r}</span>)}
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-label">📦 Products</div>
          <div className="summary-value">{uniqueProducts?.length} unique</div>
        </div>
      </div>
    </div>
  );
}
