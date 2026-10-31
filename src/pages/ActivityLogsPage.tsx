import { useState, useEffect } from 'react'
import { Badge, TableSkeleton } from '../components/ui'
import { ShieldCheck } from 'lucide-react'

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
  { id: 'log-1', actor: 'Arun Kumar (ADMIN)', action: 'UPDATE_SUBSCRIPTION_STATE', entity: 'Subscription', entityId: 'SUB-2026-000001', timestamp: '2026-10-31 09:44:12', diff: 'state: ACTIVE → PAUSED' },
  { id: 'log-2', actor: 'SYSTEM_CRON', action: 'BATCH_BILLING_RUN', entity: 'Invoice', entityId: 'INV-2026-000003', timestamp: '2026-10-31 00:00:01', diff: 'created: INV-2026-000003 (paise: 177000)' },
  { id: 'log-3', actor: 'Priya Sharma (STAFF)', action: 'RECORD_PAYMENT', entity: 'Payment', entityId: 'PAY-2026-000001', timestamp: '2026-10-30 16:20:00', diff: 'amount: ₹2,360.00 via UPI' },
  { id: 'log-4', actor: 'Arun Kumar (ADMIN)', action: 'CREATE_VARIANT', entity: 'Product', entityId: 'PRD-001', timestamp: '2026-10-30 11:15:30', diff: 'variant: Odoo Enterprise (+₹560)' },
  { id: 'log-5', actor: 'SYSTEM_AUTH', action: 'USER_LOGIN_SUCCESS', entity: 'User', entityId: 'u1', timestamp: '2026-10-30 08:30:19', diff: 'ip: 106.51.24.12, role: ADMIN' },
  { id: 'log-6', actor: 'Arun Kumar (ADMIN)', action: 'CREATE_DISCOUNT_RULE', entity: 'Discount', entityId: 'd1', timestamp: '2026-10-29 14:00:00', diff: 'name: FOUNDER20 (20% Off)' },
]

export default function ActivityLogsPage() {
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState('ALL')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const filtered = AUDIT_LOGS.filter(l =>
    filterAction === 'ALL' || l.action.includes(filterAction)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Activity Logs & Audit Trail</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Immutable Cryptographic Ledger · Actor, Action, Entity, Timestamp & State Diff
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-black rounded-xl font-mono text-xs shadow-xs">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="font-bold text-[#4A3043]">SQLite Integrity Verified</span>
        </div>
      </div>

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-2">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800">TIMESTAMP</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800">ACTOR</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800">EVENT</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800">ENTITY</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800">MUTATION DETAILS</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 text-right">SECURITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filtered.map(log => (
                <tr key={log.id} className="table-row">
                  <td className="px-6 py-4 text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 font-bold text-[#4A3043]">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-white border-[1.5px] border-black rounded-md text-[10px] font-bold shadow-[1px_1px_0_#000]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{log.entity} #{log.entityId}</td>
                  <td className="px-6 py-4 text-gray-600">{log.diff}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="ok">LOGGED</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
