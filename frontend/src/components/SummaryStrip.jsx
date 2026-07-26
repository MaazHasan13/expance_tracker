import { TrendingUp, TrendingDown, Receipt, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/format'

function StatBlock({ label, value, sub, accent }) {
  return (
    <div className="flex-1 px-6 py-5 first:pl-0 last:pr-0">
      <p className="text-[11px] font-mono tracking-widest text-ink/50 uppercase mb-1.5">{label}</p>
      <p className="font-display font-semibold text-2xl text-ink leading-none">{value}</p>
      {sub && <p className={`text-xs mt-1.5 font-medium ${accent || 'text-ink/50'}`}>{sub}</p>}
    </div>
  )
}

export default function SummaryStrip({ summary }) {
  if (!summary) return null

  const mom = summary.month_over_month_pct
  const momUp = mom !== null && mom > 0

  return (
    <div className="relative bg-paper rounded-2xl px-6 shadow-xl shadow-black/20">
      <div className="flex divide-x divide-paper-line">
        <StatBlock
          label="This Month"
          value={formatCurrency(summary.total_this_month)}
          sub={
            mom !== null
              ? `${momUp ? '+' : ''}${mom.toFixed(1)}% vs last month`
              : 'No prior data'
          }
          accent={mom === null ? 'text-ink/50' : momUp ? 'text-coral font-semibold' : 'text-teal font-semibold'}
        />
        <StatBlock
          label="All Time"
          value={formatCurrency(summary.total_all_time)}
          sub={`${summary.expense_count} transactions logged`}
        />
        <StatBlock
          label="Average"
          value={formatCurrency(summary.average_expense)}
          sub="per transaction"
        />
        <StatBlock
          label="Last Month"
          value={formatCurrency(summary.total_last_month)}
          sub="for comparison"
        />
      </div>
      <div className="absolute -bottom-2 left-3 right-3 h-2 bg-perforation rounded-b-2xl opacity-40" />
    </div>
  )
}
