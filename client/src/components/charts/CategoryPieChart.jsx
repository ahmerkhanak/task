import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.totalValue;
    const pct = total ? ((payload[0].value / total) * 100).toFixed(1) : 0;
    return (
      <div style={{
        background: 'rgba(13, 17, 32, 0.95)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>{payload[0].name}</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: payload[0].payload.fill }}>
          ${payload[0].value?.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{pct}% of total</div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
    {payload.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
        <span style={{ color: '#94a3b8' }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map(d => ({ ...d, totalValue: total }));

  return (
    <div className="glass-card chart-card animate-fade-up">
      <div className="chart-title">🏷️ Revenue by Category</div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="value"
            nameKey="category"
            cx="45%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={4}
            strokeWidth={0}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ cursor: 'pointer', filter: 'brightness(1)', transition: 'filter 0.2s' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            content={<CustomLegend />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
