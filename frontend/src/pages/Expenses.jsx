import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import {
  fetchExpenses,
  fetchCategories,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/client'
import ExpenseRow from '../components/ExpenseRow'
import ExpenseFormModal from '../components/ExpenseFormModal'
import ConfirmDialog from '../components/ConfirmDialog'

const PAGE_SIZE = 10

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = {
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort_by: 'date',
      sort_dir: 'desc',
    }
    if (search) params.search = search
    if (categoryFilter) params.category_id = categoryFilter
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    const data = await fetchExpenses(params)
    setExpenses(data.items)
    setTotal(data.total)
    setLoading(false)
  }, [page, search, categoryFilter, startDate, endDate])

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleSubmit = async (data) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data)
    } else {
      await createExpense(data)
    }
    setFormOpen(false)
    setEditingExpense(null)
    load()
  }

  const handleDelete = async () => {
    await deleteExpense(deleteTarget.id)
    setDeleteTarget(null)
    load()
  }

  const resetFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setStartDate('')
    setEndDate('')
    setPage(0)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-2xl text-paper">Expenses</h1>
          <p className="text-sm text-paper/50 mt-1">{total} transactions on record</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-2 bg-amber text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-amber-soft transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Log Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-ink-card border border-ink-line rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-ink border border-ink-line rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={15} className="text-paper/40" />
          <input
            value={search}
            onChange={(e) => {
              setPage(0)
              setSearch(e.target.value)
            }}
            placeholder="Search by title or note..."
            className="bg-transparent outline-none text-sm text-paper placeholder:text-paper/30 w-full"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setPage(0)
            setCategoryFilter(e.target.value)
          }}
          className="bg-ink border border-ink-line rounded-lg px-3 py-2 text-sm text-paper outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setPage(0)
            setStartDate(e.target.value)
          }}
          className="bg-ink border border-ink-line rounded-lg px-3 py-2 text-sm text-paper outline-none [color-scheme:dark]"
        />
        <span className="text-paper/30 text-sm">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setPage(0)
            setEndDate(e.target.value)
          }}
          className="bg-ink border border-ink-line rounded-lg px-3 py-2 text-sm text-paper outline-none [color-scheme:dark]"
        />

        {(search || categoryFilter || startDate || endDate) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-paper/50 hover:text-paper px-2"
          >
            <SlidersHorizontal size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading && <p className="text-paper/40 text-sm font-mono py-6 text-center">Loading...</p>}
        {!loading && expenses.length === 0 && (
          <p className="text-paper/40 text-sm font-mono py-10 text-center">
            No expenses match these filters.
          </p>
        )}
        {!loading &&
          expenses.map((e) => (
            <ExpenseRow
              key={e.id}
              expense={e}
              onEdit={(exp) => {
                setEditingExpense(exp)
                setFormOpen(true)
              }}
              onDelete={(exp) => setDeleteTarget(exp)}
            />
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-2 rounded-lg border border-ink-line text-paper/60 disabled:opacity-30 hover:bg-ink-card"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-mono text-paper/50">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="p-2 rounded-lg border border-ink-line text-paper/60 disabled:opacity-30 hover:bg-ink-card"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <ExpenseFormModal
        open={formOpen}
        categories={categories}
        expense={editingExpense}
        onClose={() => {
          setFormOpen(false)
          setEditingExpense(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this expense?"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
