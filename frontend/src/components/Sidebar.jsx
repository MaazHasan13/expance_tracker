import { NavLink } from 'react-router-dom'
import { LayoutGrid, Receipt, Tags, BookText } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/categories', label: 'Categories', icon: Tags },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-ink-soft border-r border-ink-line flex flex-col h-screen sticky top-0">
      <div className="px-6 py-7 flex items-center gap-2.5 border-b border-ink-line">
        <div className="w-8 h-8 rounded bg-amber flex items-center justify-center">
          <BookText size={18} className="text-ink" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display font-semibold text-paper text-lg leading-none">Ledger</p>
          <p className="text-[11px] text-paper/40 font-mono mt-1 tracking-wide">EXPENSE TRACKER</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber/15 text-amber'
                  : 'text-paper/60 hover:text-paper hover:bg-ink-card'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-ink-line">
        <p className="text-[11px] text-paper/30 font-mono leading-relaxed">
          EVERY RUPEE
          <br />
          ACCOUNTED FOR
        </p>
      </div>
    </aside>
  )
}
