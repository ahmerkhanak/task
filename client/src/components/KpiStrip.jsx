export default function KpiStrip({ kpis }) {
  if (!kpis) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const cards = [
    {
      icon: '💰',
      label: 'Total Revenue',
      value: formatCurrency(kpis.totalSales),
      subtitle: 'Across all transactions'
    },
    {
      icon: '📦',
      label: 'Total Units Sold',
      value: kpis.totalUnits?.toLocaleString(),
      subtitle: 'Units across all products'
    },
    {
      icon: '🛒',
      label: 'Avg Order Value',
      value: formatCurrency(kpis.avgOrderValue),
      subtitle: 'Per transaction average'
    },
    {
      icon: '🌍',
      label: 'Top Region',
      value: kpis.topRegion,
      subtitle: 'Highest revenue region'
    }
  ];

  return (
    <div className="kpi-strip">
      {cards.map((card, i) => (
        <div key={i} className="glass-card kpi-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="kpi-icon">{card.icon}</div>
          <div className="kpi-label">{card.label}</div>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-subtitle">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
