// Shared utility functions
import type { InvoiceState, SubscriptionState } from './data/seed'

// Format paise to INR display string
export function fmt(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

// Format a number with Indian grouping
export function fmtNum(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

// Format date to "12 Mar 2026"
export function fmtDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Subscription state → display config
export function subStateConfig(state: SubscriptionState): { label: string; className: string } {
  const map: Record<SubscriptionState, { label: string; className: string }> = {
    DRAFT:     { label: 'Draft',     className: 'badge-neutral' },
    QUOTATION: { label: 'Quotation', className: 'badge-warn'    },
    CONFIRMED: { label: 'Confirmed', className: 'badge-info'    },
    ACTIVE:    { label: 'Active',    className: 'badge-ok'      },
    PAUSED:    { label: 'Paused',    className: 'badge-warn'    },
    CLOSED:    { label: 'Closed',    className: 'badge-neutral' },
    EXPIRED:   { label: 'Expired',   className: 'badge-bad'     },
  }
  return map[state]
}

// Invoice state → display config
export function invStateConfig(state: InvoiceState): { label: string; className: string } {
  const map: Record<InvoiceState, { label: string; className: string }> = {
    DRAFT:          { label: 'Draft',          className: 'badge-neutral' },
    CONFIRMED:      { label: 'Confirmed',      className: 'badge-info'    },
    PARTIALLY_PAID: { label: 'Partial',        className: 'badge-warn'    },
    PAID:           { label: 'Paid',           className: 'badge-ok'      },
    OVERDUE:        { label: 'Overdue',        className: 'badge-bad'     },
    CANCELLED:      { label: 'Cancelled',      className: 'badge-neutral' },
  }
  return map[state]
}

// Billing period label
export function billingPeriodLabel(p: 'D' | 'W' | 'M' | 'Y'): string {
  return { D: 'Daily', W: 'Weekly', M: 'Monthly', Y: 'Annual' }[p]
}

// Payment method label
export function pmtMethodLabel(m: string): string {
  return { CASH: 'Cash', BANK_TRANSFER: 'Bank Transfer', CARD: 'Card', UPI: 'UPI', OTHER: 'Other' }[m] ?? m
}

