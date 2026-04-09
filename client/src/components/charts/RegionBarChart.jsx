import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13, 17, 32, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#6366f1' }}>
          ${payload[0].value?.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function RegionBarChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card chart-card animate-fade-up">
      <div className="chart-title">🌍 Revenue by Region</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={true} vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
