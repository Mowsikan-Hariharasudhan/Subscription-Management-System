# Brightloop — Enterprise Subscription Management System

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-v7-purple.svg)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL--Mode-lightblue.svg)](https://www.sqlite.org/)

**Brightloop** is an enterprise-grade SaaS subscription and recurring billing platform built for the **Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026**. It powers the complete subscription lifecycle—from customer onboarding, dynamic product catalogue and quotation templating to automated recurring billing, discount redemptions, tax calculations, manual payment recording, and customer self-service.

---

## 🎨 Design System: Refined Corporate Brutalism

The interface follows a **"Refined Professional Clean Corporate Structural Brutalism"** design system inspired by the Odoo Plum aesthetic:

| Design Token | Hex Code | Usage |
|---|---|---|
| **Primary Plum** | `#724B68` | Active navigation borders, primary buttons, brand accents |
| **Deep Plum** | `#36283B` | Persistent left sidebar, brand wordmarks, high-contrast headers |
| **Muted Plum** | `#91768B` | Subtle badges, secondary accents, icons |
| **Main Background** | `#F7F5F7` | Neutral light workspace backdrop |
| **White Surface** | `#FFFFFF` | Cards, modals, data tables |
| **Main Border** | `#E4DEE3` | Restrained 1px structured grid lines |
| **Primary Text** | `#29242B` | High legibility typography |
| **Secondary Text** | `#746F75` | Captions, metadata, column headings |
| **Information Accent** | `#D1ECF1` | Subtle info callouts, alert banners |

---

## 🚀 Key Features & Highlights

1. **Enterprise Role-Based Access Control (RBAC):**
   - **Admin:** Full access to all modules, staff provisioning, system settings, tax configuration, and discount rule engines.
   - **Staff:** Daily operational handling: customers, quotation templates, quotes, subscriptions, invoices, and payment recording. Cannot alter admin-only settings or provision staff.
   - **Customer:** Secure self-service portal strictly isolated to the logged-in customer's subscriptions, invoices, and payments.

2. **Dynamic Products & Attribute Variants:**
   - Catalog supporting Software (SaaS), Services, and Hardware.
   - Variants with dynamic price adjustments (e.g., Odoo Brand `+₹560`, Enterprise `+₹1,500`) stored in the database.

3. **Subscription Lifecycle State Machine:**
   - Strict status progression: `DRAFT` ➔ `QUOTATION` ➔ `CONFIRMED` ➔ `ACTIVE` ➔ `CLOSED`.
   - Actionable pause and resume controls adhering to plan capabilities.
   - Safe early closure and renewal workflows.

4. **Quotation Blueprint & Conversion Engine:**
   - Reusable Quotation Templates for sales reps with pre-configured plans, product lines, quantities, and applicable tax rates.
   - Atomic quotation-to-subscription conversion executed in a database transaction (`prisma.$transaction`).

5. **Automated Recurring Billing Engine (node-cron):**
   - Scheduled daily billing engine (`node-cron`) checking all due subscriptions.
   - Admin-only **"Run Billing Now"** trigger for instant testing and evaluations using the exact same billing service.
   - **Guaranteed Idempotency:** DB-level unique constraint (`@@unique([subscriptionId, periodStart])`) prevents duplicate billing across runs.
   - **Financial Snapshots:** Historical invoices lock in line prices, variant additions, and tax rates at the moment of billing.

6. **Automated Discount & Tax Engine:**
   - Percentage basis points (e.g. 10% = 1000 bps) and fixed paise discounts.
   - Dedicated `DiscountRedemption` tracking table enforcing minimum purchase amounts, minimum quantities, validity periods, and maximum usage quotas.
   - Flexible, editable tax rules applied dynamically during invoice calculation.

7. **Manual Payment Recording & Ledger:**
   - Internal staff payment recording (Cash, Bank Transfer, UPI, Card, Other).
   - Real-time balance calculations ensuring recorded payments never exceed outstanding amounts.
   - Automatic invoice status transition from `CONFIRMED` to `PAID` upon settlement. Partial payments maintain remaining balances.

8. **Executive Analytics Dashboard:**
   - Server-side aggregation queries for instant load times under 2 seconds.
   - Real-time KPIs: Active Subscriptions, Total Customers, Collected Revenue, Total Invoiced, Outstanding Balance, and Overdue Invoices.
   - Interactive Recharts: Monthly Collected Revenue, Subscription Growth, and Payment Status Distribution.

9. **Customer Self-Service Portal:**
   - Streamlined, mobile-responsive portal for subscribers.
   - Overview metrics, subscription tiers and renewal dates, invoice history, payment ledger, and profile management.
   - Strict multi-tenant backend isolation preventing any customer from accessing another customer's financial records.

---

## 🛠️ Mandatory Technology Stack

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS, shadcn/ui primitives, Lucide React, Recharts, React Router v6, TanStack Query v5, React Hook Form, Zod.
- **Backend:** Node.js, Express.js, TypeScript, REST API, JWT authentication, bcryptjs, Zod request validation.
- **Database:** SQLite with Prisma ORM 7 (`@prisma/adapter-better-sqlite3`, WAL mode, foreign key enforcement, minor currency units in paise).
- **Automation & Utilities:** node-cron (scheduled billing), Nodemailer (email tokens), date-fns (calendar calculations).

---

## ⚡ Quickstart Guide (Evaluator Friendly)

The application runs locally without any external database server, cloud accounts, or paid API keys.

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22.19.0)
- **npm**: v9+ (tested on npm 10.8.3)

### 2. Clone and Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mowsikan-Hariharasudhan/Subscription-Management-System.git
cd Bright-Loop

# 2. Run automated setup (installs dependencies, deploys SQLite database & seeds demo data)
npm run setup
```

*Note on Windows PowerShell: The script runs seamlessly on both Windows PowerShell and macOS/Linux bash.*

### 3. Start Development Servers

```bash
# Starts both Backend (http://localhost:5000) and Frontend (http://localhost:5173) concurrently
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Credentials

The database comes pre-seeded with realistic, interrelated enterprise demonstration data:

| Role | Email | Password | Access / Scope |
|---|---|---|---|
| **Admin** | `admin@brightloop.io` | `Admin@1234` | Full system access, staff provisioning, tax/discount setup, billing triggers |
| **Staff** | `sarah@brightloop.io` | `Staff@1234` | Customer operations, quotes, subscriptions, invoices, payment recording |
| **Staff** | `mike@brightloop.io` | `Staff@1234` | Secondary staff operator account |
| **Customer** | `customer1@example.com` | `Customer@1234` | Self-service portal: subscriptions, invoices, payments |
| **Customer** | `customer2@example.com` | `Customer@1234` | Additional pre-seeded customer accounts (up to `customer10@example.com`) |

*Convenient single-click demo login buttons are provided directly on the Login page.*

---

## 🧪 Automated Testing & Verification

Brightloop includes an automated end-to-end integration test suite validating all 16 business scenarios specified in Section 25 of the requirements:

```bash
npm test
```

### Verified Scenarios:
- `Scenario 1`: Customer registration & login with strong password policy enforcement.
- `Scenario 2`: Admin creates product with multiple price-adjusted variants.
- `Scenario 3`: Admin creates monthly subscription plan with lifecycle controls.
- `Scenario 4`: Staff creates quotation from scratch or pre-configured blueprint template.
- `Scenario 5`: Quotation flow: `DRAFT` ➔ `SENT` ➔ `ACCEPTED` ➔ Transactional Subscription creation.
- `Scenario 6 & 7`: Recurring billing engine identifies due subscriptions and generates invoices.
- `Scenario 8 & 9`: Automated discount rules applied and tax rates captured in historical snapshots.
- `Scenario 10 & 11`: Staff records partial and full payments, balance reduction, and `PAID` transition.
- `Scenario 12`: Finance dashboard real-time server-side KPI aggregations.
- `Scenario 13`: Closed or paused subscriptions do not generate future invoices.
- `Scenario 14`: Billing idempotency — repeated execution creates zero duplicate invoices.
- `Scenario 15`: Customer portal data isolation (cross-tenant access rejected with 403/404).
- `Scenario 16`: Staff RBAC boundaries — staff forbidden from creating staff or discount rules.

---

## 📡 REST API Reference Summary

All API endpoints are prefixed with `/api/v1` and protected by JWT authentication and RBAC authorization middleware:

| Route Group | Methods | Path | Description | Access |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Register customer account | Public |
| | `POST` | `/auth/login` | Authenticate & retrieve JWT | Public |
| | `POST` | `/auth/forgot-password` | Request password reset token | Public |
| | `POST` | `/auth/reset-password` | Reset password using token | Public |
| | `GET` | `/auth/me` | Current authenticated user profile | All |
| **Users** | `GET, POST` | `/users` | List users / Create staff account | Admin |
| | `PATCH, DELETE` | `/users/:id` | Update / Deactivate user | Admin |
| **Customers** | `GET, POST` | `/customers` | Paginated customer list / Create | Admin, Staff |
| | `GET, PATCH` | `/customers/:id` | Customer details & linked entities | Admin, Staff |
| **Products** | `GET` | `/products` | Filterable catalog list | All |
| | `POST, PATCH` | `/products` | Create & update catalog products | Admin |
| **Variants** | `POST, PATCH`| `/product-variants` | Dynamic variant price adjustments | Admin |
| **Plans** | `GET` | `/plans` | List active subscription plans | All |
| | `POST, PATCH` | `/plans` | Create & configure plans | Admin |
| **Taxes** | `GET` | `/taxes` | Tax rules and rates | All |
| | `POST, PATCH` | `/taxes` | Configure tax rates & validity | Admin |
| **Templates** | `GET, POST` | `/quotation-templates`| Pre-configured quotation blueprints | Admin, Staff |
| **Quotations** | `GET, POST` | `/quotations` | List / Create quotations | Admin, Staff |
| | `POST` | `/quotations/:id/confirm` | Advance quotation to `SENT` | Admin, Staff |
| | `POST` | `/quotations/:id/accept` | Mark quotation `ACCEPTED` | Admin, Staff |
| | `POST` | `/quotations/:id/convert`| Transactional conversion to Subscription | Admin, Staff |
| **Subscriptions**| `GET` | `/subscriptions` | Paginated subscriptions with filters | Admin, Staff |
| | `POST` | `/subscriptions/:id/activate` | Activate confirmed subscription | Admin, Staff |
| | `POST` | `/subscriptions/:id/pause` | Pause active subscription | Admin, Staff |
| | `POST` | `/subscriptions/:id/resume` | Resume paused subscription | Admin, Staff |
| | `POST` | `/subscriptions/:id/close` | Early or permanent closure | Admin, Staff |
| | `POST` | `/subscriptions/:id/renew` | Extend subscription expiry | Admin, Staff |
| **Invoices** | `GET` | `/invoices` | Paginated invoices with status filters | Admin, Staff |
| | `POST` | `/invoices/:id/confirm`| Confirm draft invoice | Admin, Staff |
| | `POST` | `/invoices/:id/cancel` | Cancel invoice | Admin, Staff |
| | `POST` | `/invoices/billing/run`| Manual "Run Billing Now" trigger | Admin |
| **Discounts** | `GET` | `/discounts` | List discount rules & redemptions | Admin, Staff |
| | `POST, DELETE`| `/discounts` | Create and manage discount rules | Admin |
| **Payments** | `GET, POST` | `/payments` | List payments / Record payment | Admin, Staff |
| **Dashboard** | `GET` | `/dashboard/kpis` | Real-time aggregation KPI metrics | Admin, Staff |
| | `GET` | `/dashboard/monthly-revenue` | Monthly revenue trend | Admin, Staff |
| | `GET` | `/dashboard/growth` | New subscription growth | Admin, Staff |
| **Portal** | `GET` | `/customer-portal/overview` | Customer overview metrics | Customer |
| | `GET` | `/customer-portal/subscriptions` | Customer's own subscriptions | Customer |
| | `GET` | `/customer-portal/invoices` | Customer's own invoices | Customer |
| | `GET` | `/customer-portal/payments` | Customer's payment history | Customer |

---

## 📂 Project Architecture

```
Bright-Loop/
├── client/                      # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Deep Plum Sidebar, TopNav, AppShell
│   │   │   ├── shared/          # DataTable, StatusBadge, CurrencyDisplay, PageHeader
│   │   │   └── ui/              # Button, Dialog, Card, Input, Label, Badge, Tabs
│   │   ├── context/             # AuthContext (JWT, session persistence, role guards)
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── dashboard/       # Executive KPI cards, Recharts visualizations
│   │   │   ├── customers/       # Customer directory & detail tabs
│   │   │   ├── products/        # Catalog & dynamic variant management
│   │   │   ├── plans/           # Subscription plans & frequency rules
│   │   │   ├── quotations/      # Quotation builder & blueprint templates
│   │   │   ├── subscriptions/   # Lifecycle management & state controls
│   │   │   ├── invoices/        # Invoices, lines, & "Run Billing Now"
│   │   │   ├── payments/        # Payment recording modal & audit ledger
│   │   │   ├── discounts/       # Fixed & percentage discount rules
│   │   │   ├── settings/        # System settings, tax rules, staff management
│   │   │   └── customer-portal/ # Tenant-isolated subscriber portal
│   │   ├── services/            # Axios API domain clients
│   │   └── types/               # TypeScript domain interfaces
│   └── package.json
│
├── server/                      # Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma        # Normalized schema with 20 entities & indexes
│   │   └── seed.ts              # Comprehensive demo dataset seed script
│   ├── src/
│   │   ├── config/              # Prisma client, SQLite WAL pragmas, typed env loader
│   │   ├── controllers/         # Thin HTTP controllers
│   │   ├── jobs/                # node-cron recurring billing schedule
│   │   ├── middleware/          # JWT auth, RBAC authorization, Zod validation
│   │   ├── routes/              # Modular REST routes mounted under /api/v1
│   │   ├── services/            # Business logic: billing engine, pricing, subscriptions
│   │   ├── tests/               # 16-scenario acceptance & integration test suite
│   │   ├── utils/               # Currency minor units, audit logger, pagination
│   │   └── validators/          # Zod validation schemas
│   └── package.json
│
├── .env.example                 # Environment variable template
├── package.json                 # Monorepo orchestrator scripts
└── README.md                    # Complete evaluator & developer documentation
```

---

## 🔒 Security & Data Integrity

- **Database-Level Idempotency:** The billing engine uses SQLite unique composite indexes `@@unique([subscriptionId, periodStart])` to mathematically prevent duplicate billing.
- **Financial Precision:** All monetary calculations use integer minor units (**paise** for INR), preventing JavaScript floating-point rounding discrepancies.
- **Tenant Isolation:** Customer portal endpoints dynamically filter data based on the authenticated JWT customer ID, disallowing cross-tenant data visibility.
- **Password Protection:** Minimum 9 characters, requiring uppercase, lowercase, and special characters, hashed using `bcryptjs` with salt rounds.
- **Audit Logging:** Crucial financial actions (quotation conversion, billing cycles, invoice status changes, payments) are logged to the `AuditLog` entity.

---

Developed with ❤️ for the **Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026**.

