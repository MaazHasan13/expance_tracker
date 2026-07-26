import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/format'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink-card border border-ink-line rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-paper">{d.category_name}</p>
      <p className="text-sm font-mono font-semibold text-amber">{formatCurrency(d.total)}</p>
    </div>
  )
}

export default function CategoryDonut({ data }) {
  const filtered = (data || []).filter((d) => d.total > 0)

  if (filtered.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-paper/30 text-sm font-mono">
        No expenses yet
      </div>
    )
  }

  const total = filtered.reduce((sum, d) => sum + d.total, 0)

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={filtered}
            dataKey="total"
            nameKey="category_name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {filtered.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[10px] font-mono tracking-widest text-paper/40 uppercase">Total</p>
        <p className="font-display font-semibold text-xl text-paper">{formatCurrency(total)}</p>
      </div>

      <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
        {filtered
          .sort((a, b) => b.total - a.total)
          .map((entry) => (
            <div key={entry.category_name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-paper/70 truncate">{entry.category_name}</span>
              </div>
              <span className="font-mono text-paper/90 shrink-0 ml-2">{formatCurrency(entry.total)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
