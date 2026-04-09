import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13, 17, 32, 0.95)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#8b5cf6' }}>
          ${payload[0].value?.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function SalesTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  // Show every 7th label to avoid crowding
  const tickFormatter = (value, index) => {
    if (index % 7 === 0) return value;
    return '';
  };

  return (
    <div className="glass-card chart-card animate-fade-up">
      <div className="chart-title">📈 Sales Trend Over Time</div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#salesGradient)"
            dot={false}
            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
