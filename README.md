# BRIGHTLOOP — Enterprise Subscription Management & Recurring Billing Platform

**Brightloop** is a production-grade, commercial subscription management and recurring billing SaaS. Built with **Clean Minimalist Corporate Structural Brutalism** using the signature Plum/Purple enterprise palette (`#724B68`, `#36283B`, `#F7F5F7`, `#E4DEE3`).

---

## ⚡ Quick Start (Evaluator Run Guide)

Brightloop runs entirely on a zero-config local **SQLite + Prisma 7 ORM** database with no external database dependencies.

```bash
# 1. Install dependencies
npm install

# 2. Push schema and seed the SQLite database with Indian enterprise demo accounts
npm run db:push
npm run seed

# 3. Start both Frontend (Vite) and Backend (Express API) concurrently
npm run dev:all
```

- **Frontend Application:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🔑 Demo Credentials

Click any quick-fill demo button on the login screen (`/login`) or enter manually:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **ADMIN** | `admin@brightloop.dev` | `Admin#2026` | Full platform control, products, tax rules, discounts, financial reports, manual billing runs |
| **STAFF** | `staff@brightloop.dev` | `Staff#2026` | Operations, customer management, subscriptions, invoices, and payment receipts |
| **CUSTOMER** | `customer@brightloop.dev` | `Cust#2026` | Self-service portal scoped strictly to customer records (Zoho Corp) |

---

## 🏗️ Architectural Foundations

### 1. Financial Rules & Decimal Safety
- **Integer Paise Only:** Never use floats for monetary math. Store ₹2,560.75 as `256075` paise. 
- **Server Authority:** Every subtotal, tax line (GST 18%), discount redemption, and invoice total is computed strictly by the server. Client totals are never trusted.
- **Display Formatting:** Display values are converted `paise / 100` and formatted using Indian numbering rules (`₹1,23,456.00`).

### 2. Idempotency & Anti-Double-Billing
- The billing engine and Prisma schema enforce a unique compound constraint:
  ```prisma
  @@unique([subscriptionId, periodStart, periodEnd], name: "subscription_billing_period_unique")
  ```
  Even if automated cron runs or manual triggers execute simultaneously, duplicate invoices cannot be generated.

### 3. Atomic Multi-Step Mutations
- Invoicing, payment settlements, quotation-to-subscription conversions, and discount redemptions execute inside strict **Prisma Transactions** (`prisma.$transaction`).

### 4. Role-Based Access Control & Customer Data Isolation
- Strict server-side middleware (`requireAuth`, `requireRole`) checks permissions on every mutation.
- When an authenticated customer accesses resources outside their own customer profile, the server responds with a **404 Not Found** (instead of 403) to prevent ID harvesting.

---

## 📐 Design System: "Refined Corporate Structural Brutalism"

- **Primary Plum:** `#724B68` (Sidebar brand identity, primary CTA buttons)
- **Deep Plum:** `#36283B` (Sidebar active item state, deep accents)
- **Off-White Surface:** `#F7F5F7` (Workspace canvas, table alternating headers)
- **Border Wireframe:** `#E4DEE3` (1px full-bleed rule lines dividing metrics and columns)
- **Typography:** Inter / system sans for headings, JetBrains Mono / tabular numbers for financial figures.
