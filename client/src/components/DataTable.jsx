export default function DataTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No data available
      </div>
    );
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getCategoryBadge = (cat) => {
    const map = {
      'Subscription': 'badge-subscription',
      'Add-on': 'badge-add-on',
      'One-time': 'badge-one-time'
    };
    return map[cat] || '';
  };

  return (
    <div className="glass-card table-wrapper animate-fade-up">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Category</th>
            <th>Sales</th>
            <th>Units Sold</th>
            <th>Region</th>
            <th>Customer Age</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i}>
              <td>{row.date}</td>
              <td>{row.product}</td>
              <td>
                <span className={`badge ${getCategoryBadge(row.category)}`}>
                  {row.category}
                </span>
              </td>
              <td style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {formatCurrency(row.sales)}
              </td>
              <td>{row.units_sold}</td>
              <td>{row.region}</td>
              <td>{row.customer_age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
