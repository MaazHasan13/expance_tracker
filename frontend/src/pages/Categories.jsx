import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/client'
import { getCategoryIcon } from '../utils/icons'
import ConfirmDialog from '../components/ConfirmDialog'

const SWATCHES = [
  '#E8A33D', '#2DD4BF', '#C084FC', '#F87171', '#60A5FA',
  '#4ADE80', '#FBBF24', '#F472B6', '#38BDF8', '#94A3B8',
]

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(SWATCHES[0])
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    setCategories(await fetchCategories())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setError('')
    try {
      await createCategory({ name: newName.trim(), color: newColor })
      setNewName('')
      setNewColor(SWATCHES[0])
      load()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not create category.')
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditColor(cat.color)
  }

  const saveEdit = async (id) => {
    await updateCategory(id, { name: editName.trim(), color: editColor })
    setEditingId(null)
    load()
  }

  const handleDelete = async () => {
    await deleteCategory(deleteTarget.id)
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper">Categories</h1>
        <p className="text-sm text-paper/50 mt-1">Tag expenses so the totals mean something.</p>
      </div>

      {/* Add new */}
      <form onSubmit={handleCreate} className="bg-ink-card border border-ink-line rounded-2xl p-5 space-y-3">
        <label className="text-xs font-mono tracking-wide text-paper/50 uppercase">New Category</label>
        <div className="flex items-center gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Pet Care"
            className="flex-1 bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-teal outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-amber text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-amber-soft transition-colors shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add
          </button>
        </div>
        <div className="flex items-center gap-2">
          {SWATCHES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setNewColor(c)}
              className={`w-6 h-6 rounded-full transition-transform ${
                newColor === c ? 'ring-2 ring-offset-2 ring-offset-ink-card ring-paper scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Choose color ${c}`}
            />
          ))}
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
      </form>

      {/* List */}
      <div className="space-y-2">
        {loading && <p className="text-paper/40 text-sm font-mono py-6 text-center">Loading...</p>}
        {!loading &&
          categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon)
            const isEditing = editingId === cat.id
            return (
              <div
                key={cat.id}
                className="flex items-center gap-4 bg-ink-card border border-ink-line rounded-xl px-5 py-3.5"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${(isEditing ? editColor : cat.color)}22` }}
                >
                  <Icon size={16} style={{ color: isEditing ? editColor : cat.color }} />
                </div>

                {isEditing ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-ink border border-ink-line rounded-lg px-3 py-1.5 text-sm text-paper outline-none focus:border-teal"
                    />
                    <div className="flex items-center gap-1.5">
                      {SWATCHES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full ${editColor === c ? 'ring-2 ring-paper' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="flex-1 text-sm font-medium text-paper">{cat.name}</p>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="p-2 rounded-lg hover:bg-teal/15 text-paper/50 hover:text-teal"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg hover:bg-ink text-paper/50 hover:text-paper"
                      >
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg hover:bg-ink text-paper/50 hover:text-paper"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-2 rounded-lg hover:bg-coral/15 text-paper/50 hover:text-coral"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        message={`Expenses under "${deleteTarget?.name}" will become uncategorized, not deleted.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
