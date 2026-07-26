import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency, formatMonth } from '../utils/format'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-card border border-ink-line rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-mono text-paper/60">{formatMonth(label)}</p>
      <p className="text-sm font-mono font-semibold text-teal">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-paper/30 text-sm font-mono">
        No trend data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2B2F40" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          stroke="#F7F3EA"
          strokeOpacity={0.3}
          tick={{ fill: '#F7F3EA', fillOpacity: 0.5, fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="#F7F3EA"
          strokeOpacity={0.3}
          tick={{ fill: '#F7F3EA', fillOpacity: 0.5, fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2B2F40', opacity: 0.4 }} />
        <Bar dataKey="total" fill="#2DD4BF" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}
