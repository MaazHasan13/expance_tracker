import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { fetchSummary, fetchExpenses, fetchCategories, createExpense } from '../api/client'
import SummaryStrip from '../components/SummaryStrip'
import CategoryDonut from '../components/CategoryDonut'
import TrendChart from '../components/TrendChart'
import ExpenseRow from '../components/ExpenseRow'
import ExpenseFormModal from '../components/ExpenseFormModal'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const loadAll = async () => {
    const [summaryData, expensesData, categoriesData] = await Promise.all([
      fetchSummary(),
      fetchExpenses({ limit: 6, sort_by: 'date', sort_dir: 'desc' }),
      fetchCategories(),
    ])
    setSummary(summaryData)
    setRecent(expensesData.items)
    setCategories(categoriesData)
    setLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreate = async (data) => {
    await createExpense(data)
    setFormOpen(false)
    loadAll()
  }

  if (loading) {
    return <div className="p-10 text-paper/40 font-mono text-sm">Tallying the books...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-2xl text-paper">Dashboard</h1>
          <p className="text-sm text-paper/50 mt-1">A running total of where it all went.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 bg-amber text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-amber-soft transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Log Expense
        </button>
      </div>

      <SummaryStrip summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-ink-card border border-ink-line rounded-2xl p-6">
          <h2 className="font-display font-semibold text-paper mb-1">By Category</h2>
          <p className="text-xs text-paper/40 mb-4">Where this month's money is going</p>
          <CategoryDonut data={summary.by_category} />
        </div>

        <div className="lg:col-span-3 bg-ink-card border border-ink-line rounded-2xl p-6">
          <h2 className="font-display font-semibold text-paper mb-1">6-Month Trend</h2>
          <p className="text-xs text-paper/40 mb-4">Total spend per month</p>
          <TrendChart data={summary.trend} />
        </div>
      </div>

      <div>
        <h2 className="font-display font-semibold text-paper mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="text-paper/40 text-sm font-mono py-6 text-center">
              Nothing logged yet — add your first expense above.
            </p>
          )}
          {recent.map((e) => (
            <ExpenseRow key={e.id} expense={e} readOnly />
          ))}
        </div>
      </div>

      <ExpenseFormModal
        open={formOpen}
        categories={categories}
        expense={null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
