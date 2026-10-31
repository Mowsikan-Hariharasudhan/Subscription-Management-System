import type {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react'

// ---- Badge (Neo-Brutalist with Shadow) ----
interface BadgeProps {
  children: ReactNode
  variant?: 'ok' | 'warn' | 'bad' | 'info' | 'neutral'
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const cls = {
    ok: 'bg-[#d1fae5] text-[#047857]',
    warn: 'bg-[#fef3c7] text-[#b45309]',
    bad: 'bg-[#fee2e2] text-[#b91c1c]',
    info: 'bg-[#e0e7ff] text-[#3730a3]',
    neutral: 'bg-white text-gray-700',
  }[variant]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider border-[1.5px] border-black rounded-md shadow-[2px_2px_0_#000] font-mono ${cls}`}
    >
      {children}
    </span>
  )
}

// ---- Buttons (Shimmering Primary & Tactile Secondary) ----
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function Btn({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  const sizes = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary: 'btn-primary text-white',
    secondary:
      'bg-white border-[1.5px] border-black text-[#4A3043] hover:bg-gray-50 hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-[0_2px_0_0_#000]',
    ghost: 'bg-transparent text-gray-700 hover:bg-black/5 border border-transparent',
    danger:
      'bg-red-600 hover:bg-red-700 text-white border-[1.5px] border-black shadow-[0_4px_0_0_#000] hover:shadow-[0_6px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
  }

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ---- Input Fields with Smooth Focus ----
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const innerId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={innerId}
          className="text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase font-mono"
        >
          {label}
        </label>
      )}
      <input
        id={innerId}
        className={`input-focus w-full px-4 py-2.5 text-[0.875rem] bg-white border-[1.5px] border-black rounded-xl text-[#4A3043] placeholder:text-gray-400 shadow-sm ${
          error ? '!border-red-600' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 font-mono">{hint}</p>}
    </div>
  )
}

// ---- Select Dropdowns ----
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  const innerId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={innerId}
          className="text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase font-mono"
        >
          {label}
        </label>
      )}
      <select
        id={innerId}
        className={`input-focus w-full px-4 py-2.5 text-[0.875rem] bg-white border-[1.5px] border-black rounded-xl text-[#4A3043] shadow-sm font-medium ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

// ---- Table Primitives (Glass Neo-Brutalist Panel) ----
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="w-full overflow-x-auto">
        <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
      </div>
    </div>
  )
}

export function Th({ children, className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-6 py-4 text-left text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 bg-white/60 border-b-[1.5px] border-black font-mono whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function Td({ children, className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-6 py-4 text-[0.875rem] border-b border-black/10 text-gray-900 ${className}`} {...props}>
      {children}
    </td>
  )
}

export function Tr({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <tr
      className={`table-row ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// ---- Glass Cards ----
export function Card({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div className={`glass-panel rounded-2xl anim-spring ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ---- Page Header ----
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-black/10 anim-spring stagger-1 mb-8">
      <div>
        <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">{title}</h1>
        {subtitle && <p className="text-[0.9375rem] text-gray-600 font-medium mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

// ---- Empty State ----
export function EmptyState({
  icon,
  title,
  action,
}: {
  icon: ReactNode
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
      <div className="text-gray-400">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      {action}
    </div>
  )
}

// ---- Stat Card / KPI ----
export function KpiCell({
  label,
  value,
  delta,
  deltaPositive,
}: {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 anim-spring cursor-default">
      <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 mb-2 font-mono">
        {label}
      </p>
      <p className="text-[2rem] font-bold font-mono tracking-tight text-[#4A3043] leading-none tabular-nums">
        {value}
      </p>
      {delta && (
        <p
          className={`text-xs mt-3 font-mono font-medium flex items-center gap-1 ${
            deltaPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${deltaPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {delta}
        </p>
      )}
    </div>
  )
}

// ---- Search Input ----
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M10 10L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search records…'}
        className="input-focus pl-9 pr-4 py-2 text-[0.8125rem] bg-white border-[1.5px] border-black rounded-xl text-[#4A3043] placeholder:text-gray-400 w-56 shadow-xs"
      />
    </div>
  )
}

// ---- Pill toggle flag ----
export function FlagBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] font-mono font-bold uppercase tracking-wide border-[1.5px] rounded-md ${
        on
          ? 'border-black text-[#4A3043] bg-emerald-100 shadow-[1px_1px_0_#000]'
          : 'border-black/30 text-gray-400 bg-white'
      }`}
    >
      {label}
    </span>
  )
}

// ---- Skeleton Loader Primitives ----
export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function KpiSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 anim-spring">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32 mb-3" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="px-6 py-4 bg-white/60 border-b-[1.5px] border-black flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-black/10">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex gap-6 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-4 ${c === 0 ? 'w-24' : 'flex-1'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 anim-spring space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-black/10">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <div className="h-56 w-full flex items-end gap-6 pt-6 px-4">
        {[40, 25, 60, 45, 80, 65].map((pct, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
            <Skeleton className="w-full rounded-t-md" style={{ height: `${pct}%` }} />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 anim-spring space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-full" />
      <div className="pt-2 flex justify-between items-center border-t border-black/10">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}
