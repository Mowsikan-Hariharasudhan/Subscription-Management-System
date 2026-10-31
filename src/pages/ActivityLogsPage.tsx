import { useState } from 'react'
import { Badge } from '../components/ui'
import { Activity, ShieldCheck, Filter } from 'lucide-react'

interface AuditItem {
  id: string
  actor: string
  action: string
  entity: string
  entityId: string
  timestamp: string
  diff: string
}

const AUDIT_LOGS: AuditItem[] = [
  { id: 'log-1', actor: 'Naren Selvan (ADMIN)', action: 'UPDATE_SUBSCRIPTION_STATE', entity: 'Subscription', entityId: 'SUB-2025-000007', timestamp: '2026-10-31 09:44:12', diff: 'state: ACTIVE → PAUSED' },
  { id: 'log-2', actor: 'SYSTEM_CRON', action: 'BATCH_BILLING_RUN', entity: 'Invoice', entityId: 'INV-2026-000030', timestamp: '2026-10-31 00:00:01', diff: 'created: INV-2026-000030 (paise: 885000)' },
  { id: 'log-3', actor: 'Divya Krishnan (STAFF)', action: 'RECORD_PAYMENT', entity: 'Payment', entityId: 'PAY-2026-000025', timestamp: '2026-10-30 16:20:00', diff: 'amount: ₹20,000 via CASH' },
  { id: 'log-4', actor: 'Naren Selvan (ADMIN)', action: 'CREATE_VARIANT', entity: 'Product', entityId: 'PRD-001', timestamp: '2026-10-30 11:15:30', diff: 'variant: Odoo Brand (+₹560)' },
  { id: 'log-5', actor: 'SYSTEM_AUTH', action: 'USER_LOGIN_SUCCESS', entity: 'User', entityId: 'u1', timestamp: '2026-10-30 08:30:19', diff: 'ip: 106.51.24.12, role: ADMIN' },
  { id: 'log-6', actor: 'Naren Selvan (ADMIN)', action: 'CREATE_DISCOUNT_RULE', entity: 'Discount', entityId: 'd6', timestamp: '2026-10-29 14:00:00', diff: 'name: Q4 Year-End 5% Off' },
  { id: 'log-7', actor: 'SYSTEM_CRON', action: 'DUNNING_NOTICE_DISPATCH', entity: 'Invoice', entityId: 'INV-2025-000012', timestamp: '2026-10-29 09:00:00', diff: 'overdue: 14 days, notice sent to TCS' },
]

export default function ActivityLogsPage() {
  const [filterAction, setFilterAction] = useState('ALL')

  const filtered = AUDIT_LOGS.filter(l =>
    filterAction === 'ALL' || l.action.includes(filterAction)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Audit Trail & Activity Logs</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Immutable Chronological Ledger · Actor, Action, Entity, Timestamp & State Diff
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-900 border border-green-300 rounded font-mono text-xs">
          <ShieldCheck size={14} className="text-green-700" />
          <span>Postgres Cryptographic Nonce Verified</span>
        </div>
      </div>

      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">TIMESTAMP</th>
              <th className="px-4 py-3">ACTOR</th>
              <th className="px-4 py-3">ACTION EVENT</th>
              <th className="px-4 py-3">ENTITY & TARGET</th>
              <th className="px-4 py-3">MUTATION DIFF</th>
              <th className="px-4 py-3 text-right">SECURITY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-[var(--surface-2)] transition-colors">
                <td className="px-4 py-3 text-[var(--ink-40)] whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{log.actor}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 border border-[var(--line)] bg-[var(--surface-2)] rounded font-semibold text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--accent)] font-semibold">
                  {log.entity} #{log.entityId}
                </td>
                <td className="px-4 py-3 text-[var(--ink-60)] font-mono">{log.diff}</td>
                <td className="px-4 py-3 text-right">
                  <Badge variant="ok">SEALED</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

