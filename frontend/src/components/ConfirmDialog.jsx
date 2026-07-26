import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-ink-card border border-ink-line rounded-2xl p-6 w-full max-w-sm animate-rise">
        <div className="w-11 h-11 rounded-full bg-coral/15 flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-coral" />
        </div>
        <h3 className="font-display font-semibold text-paper text-lg">{title}</h3>
        <p className="text-sm text-paper/60 mt-1.5 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-ink-line text-paper/70 text-sm font-medium hover:bg-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-coral text-ink text-sm font-semibold hover:bg-coral-soft transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
