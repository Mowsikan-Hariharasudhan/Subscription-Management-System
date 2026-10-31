// Shared UI primitives — all design-system compliant
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'

// ---- Badge ----
interface BadgeProps { children: ReactNode; variant?: 'ok' | 'warn' | 'bad' | 'info' | 'neutral' }
export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const cls = {
    ok:      'bg-green-50 text-green-700 border-green-300',
    warn:    'bg-yellow-50 text-yellow-700 border-yellow-300',
    bad:     'bg-red-50 text-red-700 border-red-300',
    info:    'bg-blue-50 text-blue-700 border-blue-300',
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-300',
  }[variant]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide border rounded-sm ${cls}`}>
      {children}
    </span>
  )
}

// ---- Button ----
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}
export function Btn({ children, variant = 'secondary', size = 'md', className = '', ...props }: BtnProps) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm' }
  const variants = {
    primary:   'bg-[var(--accent)] text-white hover:bg-blue-900',
    secondary: 'bg-white text-[var(--ink)] border border-[var(--line-strong)] hover:bg-[var(--surface-2)]',
    ghost:     'bg-transparent text-[var(--ink-60)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]',
    danger:    'bg-[var(--bad)] text-white hover:bg-red-700',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ---- Input ----
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; hint?: string }
export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const innerId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={innerId} className="text-xs font-medium text-[var(--ink-60)]">{label}</label>}
      <input
        id={innerId}
        className={`w-full px-3 py-2 text-sm border rounded bg-white text-[var(--ink)] placeholder:text-[var(--ink-40)]
          border-[var(--line)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:outline-none
          transition-colors ${error ? 'border-[var(--bad)] focus:border-[var(--bad)]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--bad)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--ink-40)]">{hint}</p>}
    </div>
  )
}

// ---- Select ----
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string }
export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  const innerId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={innerId} className="text-xs font-medium text-[var(--ink-60)]">{label}</label>}
      <select
        id={innerId}
        className={`w-full px-3 py-2 text-sm border border-[var(--line)] rounded bg-white text-[var(--ink)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:outline-none transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

// ---- Table primitives ----
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm border-collapse ${className}`}>{children}</table>
    </div>
  )
}

export function Th({ children, className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-2.5 text-left text-[10px] font-mono font-semibold uppercase tracking-wide text-[var(--ink-40)] bg-[var(--surface)] border-b border-[var(--line-strong)] whitespace-nowrap ${className}`} {...props}>
      {children}
    </th>
  )
}

export function Td({ children, className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-[var(--ink)] border-b border-[var(--line)] ${className}`} {...props}>
      {children}
    </td>
  )
}

export function Tr({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={`hover:bg-[var(--surface-2)] transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// ---- Card ----
export function Card({ children, className = '', padding = true }: { children: ReactNode; className?: string; padding?: boolean }) {
  return (
    <div className={`bg-white border border-[var(--line)] rounded-lg shadow-sm ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ---- Page header ----
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[var(--ink-60)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}

// ---- Empty state ----
export function EmptyState({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--ink-40)]">
      <div className="text-[var(--line)]">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      {action}
    </div>
  )
}

// ---- Stat card (KPI) ----
export function KpiCell({ label, value, delta, deltaPositive }: {
  label: string; value: string; delta?: string; deltaPositive?: boolean
}) {
  return (
    <div className="flex-1 min-w-0 px-6 py-5 border-r border-[var(--line-strong)] last:border-r-0">
      <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)] mb-1">{label}</p>
      <p className="text-2xl font-semibold font-mono tracking-tight text-[var(--ink)]">{value}</p>
      {delta && (
        <p className={`text-xs mt-1 font-mono ${deltaPositive ? 'text-[var(--ok)]' : 'text-[var(--bad)]'}`}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </p>
      )}
    </div>
  )
}

// ---- Pill toggle flag ----
export function FlagBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-px text-[9px] font-mono font-semibold uppercase tracking-wide border rounded-sm
      ${on ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] text-[var(--ink-40)] bg-white'}`}>
      {label}
    </span>
  )
}

// ---- Search input ----
export function SearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-40)]" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M10 10L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        className="pl-8 pr-3 py-1.5 text-sm border border-[var(--line)] rounded bg-white text-[var(--ink)] placeholder:text-[var(--ink-40)]
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:outline-none w-56 transition-colors"
      />
    </div>
  )
}

