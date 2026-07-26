import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
]

const emptyForm = {
  title: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  category_id: '',
  payment_method: 'card',
  description: '',
}

export default function ExpenseFormModal({ open, categories, expense, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        amount: String(expense.amount),
        date: expense.date,
        category_id: expense.category_id || '',
        payment_method: expense.payment_method,
        description: expense.description || '',
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [expense, open])

  if (!open) return null

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Give this expense a title.')
    const amountNum = Number(form.amount)
    if (!amountNum || amountNum <= 0) return setError('Enter an amount greater than zero.')

    setSaving(true)
    setError('')
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: amountNum,
        date: form.date,
        category_id: form.category_id || null,
        payment_method: form.payment_method,
        description: form.description.trim() || null,
      })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not save this expense. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-ink-card border border-ink-line rounded-2xl w-full max-w-md animate-rise max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-line sticky top-0 bg-ink-card">
          <h3 className="font-display font-semibold text-paper text-lg">
            {expense ? 'Edit Expense' : 'Log an Expense'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink text-paper/50 hover:text-paper">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Title</label>
            <input
              autoFocus
              value={form.title}
              onChange={handleChange('title')}
              placeholder="e.g. Groceries at BigBasket"
              className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-teal outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={handleChange('amount')}
                placeholder="0.00"
                className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm font-mono text-paper placeholder:text-paper/30 focus:border-teal outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange('date')}
                className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper focus:border-teal outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Category</label>
              <select
                value={form.category_id}
                onChange={handleChange('category_id')}
                className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper focus:border-teal outline-none"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Payment</label>
              <select
                value={form.payment_method}
                onChange={handleChange('payment_method')}
                className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper focus:border-teal outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">Notes (optional)</label>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              rows={2}
              placeholder="Anything worth remembering about this one"
              className="mt-1.5 w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-teal outline-none resize-none"
            />
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-ink-line text-paper/70 text-sm font-medium hover:bg-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-amber text-ink text-sm font-semibold hover:bg-amber-soft transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
