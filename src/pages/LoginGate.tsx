import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { MODELS, type ModelId } from '../GatewayPage'
import { Check } from 'lucide-react'

export default function LoginGate() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Selected AI route
  const [selectedModel, setSelectedModel] = useState<ModelId>(() => {
    return (localStorage.getItem('bl.provider') as ModelId) || 'deepseek'
  })

  // Auth fields
  const [email, setEmail] = useState('admin@brightloop.dev')
  const [password, setPassword] = useState('Admin#2026')
  const [error, setError] = useState('')
  const [forgotModal, setForgotModal] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  // Animated KPI numbers on mount (400ms duration)
  const [subsCount, setSubsCount] = useState(0)
  const [mrrCount, setMrrCount] = useState(0)
  const [overdueCount, setOverdueCount] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 400
    const targetSubs = 1284
    const targetMrr = 4263000
    const targetOverdue = 37

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setSubsCount(Math.floor(progress * targetSubs))
      setMrrCount(Math.floor(progress * targetMrr))
      setOverdueCount(Math.floor(progress * targetOverdue))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [])

  // Password rules validation
  const hasLength = password.length >= 9
  const hasCase = /[A-Z]/.test(password) && /[a-z]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const allPass = hasLength && hasCase && hasSymbol

  const handleModelSelect = (id: ModelId) => {
    setSelectedModel(id)
    localStorage.setItem('bl.provider', id)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (!res.ok) {
      setError(res.error || 'Authentication failed. Please verify credentials.')
      return
    }
    // Navigate into the chosen model's experience or default to deepseek
    localStorage.setItem('bl.provider', selectedModel)
    navigate('/dashboard')
  }

  const fillCredentials = (em: string, pw: string) => {
    setEmail(em)
    setPassword(pw)
    setError('')
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[var(--bg)] text-[var(--ink)]">
      {/* LEFT PANEL (50%) — Brand & Structural Stats */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--line-strong)] bg-[var(--bg)]">
        <div>
          <div className="w-8 h-8 bg-[var(--ink)] rounded-sm flex items-center justify-center mb-6">
            <span className="font-mono text-white font-bold text-lg leading-none">B</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">BRIGHTLOOP</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-40)] mt-1.5 font-semibold">
            SUBSCRIPTION OPERATIONS
          </p>
          <p className="mt-8 text-sm text-[var(--ink-60)] max-w-md leading-relaxed">
            High-density enterprise billing engine and revenue lifecycle management system. Decimal-safe monetary arithmetic, immutable audit logs, and automated recurring invoice generation.
          </p>
        </div>

        {/* 3-Row Mini-Table with 400ms count-up */}
        <div className="mt-12 md:mt-0 pt-8 border-t border-[var(--line-strong)]">
          <div className="space-y-0 text-xs font-mono">
            <div className="flex justify-between items-center py-2.5 border-b border-[var(--line)]">
              <span className="uppercase text-[var(--ink-40)] tracking-wider">ACTIVE SUBSCRIPTIONS</span>
              <span className="font-semibold text-[var(--ink)] text-sm">{subsCount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[var(--line)]">
              <span className="uppercase text-[var(--ink-40)] tracking-wider">MRR</span>
              <span className="font-semibold text-[var(--ink)] text-sm">₹{mrrCount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="uppercase text-[var(--ink-40)] tracking-wider">OVERDUE INVOICES</span>
              <span className="font-semibold text-[var(--bad)] text-sm">{overdueCount}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
            <span className="font-mono text-[10px] text-[var(--ink-40)] uppercase tracking-wider">
              System Live · PostgreSQL & Drizzle Architecture
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (50%) — Centered Auth Column & Model Selection */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex items-center justify-center bg-[var(--surface)]">
        <div className="w-full max-w-[440px] flex flex-col justify-center">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--ink-40)]">
                AUTHENTICATION & ENGINE GATE
              </span>
              <button
                onClick={() => navigate('/')}
                className="font-mono text-[10px] text-[var(--accent)] hover:underline"
              >
                Model Matrix →
              </button>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] mt-1">Sign in to workspace</h2>
            <p className="text-xs text-[var(--ink-60)] mt-0.5">
              Select an AI model architecture then enter credentials.
            </p>
          </div>

          {/* Model Gate Grid */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-40)] mb-2 font-semibold">
              CHOOSE MODEL ROUTE
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.slice(0, 4).map(m => {
                const isSelected = selectedModel === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModelSelect(m.id)}
                    className={`p-2.5 border rounded text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-white border-[var(--line)] hover:border-[var(--line-strong)] text-[var(--ink)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <m.Icon
                        width={16}
                        height={16}
                        style={{ color: isSelected ? 'var(--accent)' : m.iconColor }}
                      />
                      {isSelected ? (
                        <span className="font-mono text-[9px] font-bold text-[var(--accent)]">ROUTE</span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full border border-[var(--line)]" />
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-semibold leading-tight">{m.name}</p>
                      <p className="text-[10px] text-[var(--ink-40)] leading-none">{m.provider}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Lovable AI 5th row option */}
            {MODELS[4] && (() => {
              const LovableIconComp = MODELS[4].Icon
              return (
                <button
                  type="button"
                  onClick={() => handleModelSelect(MODELS[4].id)}
                  className={`mt-2 w-full p-2.5 border rounded text-left transition-all flex items-center justify-between ${
                    selectedModel === 'lovable'
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                      : 'bg-white border-[var(--line)] hover:border-[var(--line-strong)] text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-[#EC4899]">
                      <LovableIconComp width={16} height={16} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold">{MODELS[4].name}</span>
                      <span className="text-[10px] text-[var(--ink-40)] ml-2">{MODELS[4].provider}</span>
                    </div>
                  </div>
                  {selectedModel === 'lovable' ? (
                    <span className="font-mono text-[9px] font-bold text-[var(--accent)]">ROUTE: LOVABLE</span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--ink-40)]">Select Route</span>
                  )}
                </button>
              )
            })()}
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 border border-[var(--bad)] bg-red-50 text-[var(--bad)] text-xs rounded font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-60)] mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-[var(--line)] rounded bg-white text-[var(--ink)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:outline-none"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[var(--ink-60)]">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-[var(--ink-60)] hover:text-[var(--ink)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-[var(--line)] rounded bg-white text-[var(--ink)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:outline-none"
              />

              {/* Live Password-Rule Meter (3 bars: LENGTH / CASE / SYMBOL) */}
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-3 gap-1.5">
                  <div
                    className={`h-1 rounded-sm transition-colors ${
                      allPass ? 'bg-[var(--accent)]' : hasLength ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-sm transition-colors ${
                      allPass ? 'bg-[var(--accent)]' : hasCase ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-sm transition-colors ${
                      allPass ? 'bg-[var(--accent)]' : hasSymbol ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[var(--ink-40)] uppercase">
                  <span className={hasLength ? 'text-[var(--ink)] font-bold' : ''}>≥9 CHARS</span>
                  <span className={hasCase ? 'text-[var(--ink)] font-bold' : ''}>Aa MIX</span>
                  <span className={hasSymbol ? 'text-[var(--ink)] font-bold' : ''}>SPECIAL #</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[var(--accent)] hover:bg-blue-900 text-white text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Sign in to Brightloop
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-[var(--line)]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-40)] mb-2 font-semibold">
              INSTANT DEMO ROLES (CLICK TO FILL)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@brightloop.dev', 'Admin#2026')}
                className="px-2 py-1.5 text-xs font-mono border border-[var(--line)] hover:border-[var(--ink)] rounded bg-white text-[var(--ink)] text-center transition-colors cursor-pointer"
              >
                ADMIN
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('staff@brightloop.dev', 'Staff#2026')}
                className="px-2 py-1.5 text-xs font-mono border border-[var(--line)] hover:border-[var(--ink)] rounded bg-white text-[var(--ink)] text-center transition-colors cursor-pointer"
              >
                STAFF
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('customer@brightloop.dev', 'Cust#2026')}
                className="px-2 py-1.5 text-xs font-mono border border-[var(--line)] hover:border-[var(--ink)] rounded bg-white text-[var(--ink)] text-center transition-colors cursor-pointer"
              >
                CUSTOMER
              </button>
            </div>

            {/* Seed demo credentials block bottom-right */}
            <div className="mt-4 p-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded font-mono text-[10px] text-[var(--ink-60)] space-y-1">
              <div className="flex justify-between">
                <span>admin@brightloop.dev</span>
                <span className="text-[var(--ink)]">Admin#2026</span>
              </div>
              <div className="flex justify-between">
                <span>staff@brightloop.dev</span>
                <span className="text-[var(--ink)]">Staff#2026</span>
              </div>
              <div className="flex justify-between">
                <span>customer@brightloop.dev</span>
                <span className="text-[var(--ink)]">Cust#2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-[var(--line-strong)] rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-semibold text-[var(--ink)]">Reset your password</h3>
            <p className="text-xs text-[var(--ink-60)] mt-1">
              We'll record a single-use 30-minute token in the system Outbox.
            </p>
            {resetSent ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                Password reset token generated and dispatched to outbox.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="name@company.com"
                  className="w-full px-3 py-1.5 text-sm border border-[var(--line)] rounded"
                />
                <button
                  onClick={() => setResetSent(true)}
                  className="w-full py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded"
                >
                  Dispatch Reset Link
                </button>
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setForgotModal(false)
                  setResetSent(false)
                }}
                className="text-xs text-[var(--ink-60)] hover:text-[var(--ink)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
