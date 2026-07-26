import { Pencil, Trash2 } from 'lucide-react'
import { getCategoryIcon } from '../utils/icons'
import { formatCurrency, formatDate, paymentMethodLabel } from '../utils/format'

export default function ExpenseRow({ expense, onEdit, onDelete, readOnly = false }) {
  const category = expense.category
  const Icon = getCategoryIcon(category?.icon)
  const color = category?.color || '#94A3B8'

  return (
    <div className="group relative flex items-center gap-4 bg-paper rounded-xl px-5 py-4 animate-rise">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}22` }}
      >
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink text-sm truncate">{expense.title}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-ink/50">
          <span>{formatDate(expense.date)}</span>
          <span className="w-1 h-1 rounded-full bg-ink/20" />
          <span>{category?.name || 'Uncategorized'}</span>
          <span className="w-1 h-1 rounded-full bg-ink/20" />
          <span className="font-mono">{paymentMethodLabel(expense.payment_method)}</span>
        </div>
      </div>

      <p className="font-mono font-semibold text-ink text-base shrink-0 tabular-nums">
        {formatCurrency(expense.amount)}
      </p>

      {!readOnly && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 rounded-lg hover:bg-ink/10 text-ink/50 hover:text-ink transition-colors"
            aria-label="Edit expense"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-2 rounded-lg hover:bg-coral/15 text-ink/50 hover:text-coral transition-colors"
            aria-label="Delete expense"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
