import { useState } from 'react'
import { MODELS, type ModelId } from '../GatewayPage'
import { Badge, Btn } from '../components/ui'
import { Wand2, Play, Check, RefreshCw, Eye, Split, History, ShieldAlert } from 'lucide-react'

export default function AiStudioPage() {
  const [selectedProvider, setSelectedProvider] = useState<ModelId>('deepseek')
  const [selectedModule, setSelectedModule] = useState('Dashboard')
  const [prompt, setPrompt] = useState(
    'Redesign the dashboard with a more structured financial overview, higher data density, and a corporate structural brutalist aesthetic.'
  )
  const [generating, setGenerating] = useState(false)
  const [compareMode, setCompareMode] = useState(true)
  const [approvedNotice, setApprovedNotice] = useState('')
  const [versionHistory, setVersionHistory] = useState([
    { version: 'v1.0 (Base)', provider: 'Base Corporate', date: '2026-10-30', status: 'Active' },
    { version: 'v1.1 (DeepSeek)', provider: 'DeepSeek-V3', date: '2026-10-31', status: 'Draft' },
  ])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      const newV = {
        version: `v1.${versionHistory.length + 1} (${selectedProvider.toUpperCase()})`,
        provider: selectedProvider,
        date: '2026-10-31',
        status: 'Proposal',
      }
      setVersionHistory([newV, ...versionHistory])
    }, 1000)
  }

  const handleApprove = () => {
    setApprovedNotice(`Design version approved! Applied to live ${selectedModule} layout.`)
    setTimeout(() => setApprovedNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">AI Design Studio & Arena</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Multi-Model UI Generation Pipeline · ChatGPT, DeepSeek, Gemini, Claude, Lovable
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn
            variant={compareMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className="font-mono text-xs"
          >
            <Split size={12} /> {compareMode ? 'Exit Compare' : 'Side-by-Side A/B'}
          </Btn>
          <Btn variant="primary" size="sm" onClick={handleApprove} className="font-mono text-xs">
            <Check size={12} /> Approve Winning UI
          </Btn>
        </div>
      </div>

      {approvedNotice && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs font-mono rounded flex justify-between items-center">
          <span>{approvedNotice}</span>
          <button onClick={() => setApprovedNotice('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Generator Control Strip */}
      <div className="border border-[var(--line-strong)] bg-white p-5 font-mono text-xs space-y-4">
        {/* Step 1 & 2: Select Module & Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[var(--ink-40)] uppercase mb-1">
              1. TARGET MODULE TO REDESIGN
            </label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--line)] rounded bg-[var(--surface-2)] text-xs font-semibold"
            >
              <option value="Dashboard">Executive Dashboard & KPI Band</option>
              <option value="Catalog">Products & Variant Surcharge Matrix</option>
              <option value="Subscriptions">Subscription Pipeline & State Machine</option>
              <option value="Invoices">Batch Billing Engine & Invoices</option>
              <option value="CustomerPortal">Customer Self-Service Portal</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--ink-40)] uppercase mb-1">
              2. SELECT AI ARCHITECT ENGINE
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedProvider(m.id)}
                  className={`p-1.5 border rounded text-center transition-all cursor-pointer ${
                    selectedProvider === m.id
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] font-bold'
                      : 'bg-white border-[var(--line)] hover:border-[var(--line-strong)] text-[var(--ink)]'
                  }`}
                >
                  <p className="text-[10px] truncate">{m.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Prompt Input */}
        <div>
          <label className="block text-[11px] font-bold text-[var(--ink-40)] uppercase mb-1">
            3. DESIGN SPECIFICATION PROMPT
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="flex-1 px-3 py-2 border border-[var(--line)] rounded bg-white text-xs focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 bg-[var(--line-strong)] hover:bg-black text-white font-bold rounded text-xs flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Wand2 size={15} className={generating ? 'animate-spin' : ''} />
              <span>{generating ? 'Compiling...' : 'Generate UI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Live Preview Workspace */}
      <div className="border border-[var(--line-strong)] bg-white p-5">
        <div className="flex justify-between items-center pb-3 border-b border-[var(--line)] mb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <span className="font-bold text-[var(--ink)]">Sandboxed DOM Preview Environment</span>
            <span className="text-[var(--ink-40)]">({selectedModule} · {selectedProvider.toUpperCase()})</span>
          </div>
          <span className="text-[10px] text-[var(--ink-40)] uppercase">
            Isolated Context · Zero Production Contamination
          </span>
        </div>

        {compareMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version A */}
            <div className="border border-[var(--line)] rounded p-4 bg-[var(--surface-2)]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--line)] text-xs font-mono">
                <span className="font-bold text-[var(--ink)]">OPTION A: Base Production</span>
                <Badge variant="ok">APPROVED CURRENT</Badge>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-white border border-[var(--line)] rounded">
                  <p className="text-[10px] text-[var(--ink-40)] uppercase">MRR METRIC</p>
                  <p className="text-xl font-bold mt-0.5">₹42,63,000</p>
                  <p className="text-[10px] text-[var(--ok)]">Standard Corporate Layout</p>
                </div>
                <div className="p-3 bg-white border border-[var(--line)] rounded">
                  <p className="text-[10px] text-[var(--ink-40)] uppercase">RECURRING INVOICES</p>
                  <p className="text-sm font-semibold mt-1">100 Invoices in PostgreSQL DB</p>
                </div>
              </div>
            </div>

            {/* Version B (AI Proposal) */}
            <div className="border-2 border-[var(--accent)] rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--line)] text-xs font-mono">
                <span className="font-bold text-[var(--accent)]">
                  OPTION B: {selectedProvider.toUpperCase()} PROPOSAL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent)] text-white font-bold rounded">
                  NEW CANDIDATE
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[var(--accent-soft)] border border-[var(--accent)] rounded">
                  <p className="text-[10px] text-[var(--accent)] uppercase font-bold">KINETIC REVENUE CELL</p>
                  <p className="text-2xl font-bold text-[var(--accent)] mt-0.5">₹42,63,000.00</p>
                  <p className="text-[10px] text-[var(--ink-60)]">
                    Ultra-dense structural brutalist spacing with exposed 1px rules
                  </p>
                </div>
                <div className="p-3 bg-zinc-900 text-white rounded">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">REVENUE INTEGRITY</p>
                  <p className="text-xs mt-1 text-zinc-300">
                    Real-time paise math lock: 142 Active subs scheduled with zero double-billing risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-[var(--line)] rounded text-center text-xs font-mono text-[var(--ink-60)]">
            Full-width single preview active for {selectedModule}. Toggle Side-by-Side to inspect diff.
          </div>
        )}
      </div>

      {/* Version History Log */}
      <div className="border border-[var(--line-strong)] bg-white p-5 font-mono text-xs">
        <h3 className="font-bold text-sm text-[var(--ink)] mb-3 pb-2 border-b border-[var(--line)]">
          Design Version & Prompt Audit History
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--line)] text-[var(--ink-40)]">
              <th className="py-2">VERSION</th>
              <th className="py-2">PROVIDER</th>
              <th className="py-2">TIMESTAMP</th>
              <th className="py-2">STATUS</th>
              <th className="py-2 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {versionHistory.map((v, i) => (
              <tr key={i} className="hover:bg-[var(--surface-2)]">
                <td className="py-2.5 font-bold">{v.version}</td>
                <td className="py-2.5">{v.provider}</td>
                <td className="py-2.5 text-[var(--ink-40)]">{v.date}</td>
                <td className="py-2.5">
                  <Badge variant={v.status === 'Active' ? 'ok' : 'info'}>{v.status}</Badge>
                </td>
                <td className="py-2.5 text-right">
                  <button className="text-[10px] text-[var(--accent)] font-bold hover:underline">
                    Restore Snapshot
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

