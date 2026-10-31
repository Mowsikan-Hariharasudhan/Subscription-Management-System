# BRIGHTLOOP — Subscription Management & Revenue Operations Platform

**Brightloop** is a commercially credible, enterprise-grade subscription management and recurring billing SaaS platform designed with **Clean Minimalist Corporate Structural Brutalism** (Stripe · Linear · Ramp · Vercel).

---

## 🚀 Live Access

The application runs locally on Vite + React 19 + TypeScript + Tailwind CSS:
- **AI Model Selection Gateway:** [http://localhost:5173/](http://localhost:5173/)
- **Signature 50/50 Login Gate:** [http://localhost:5173/login](http://localhost:5173/login)
- **Executive Operations Console:** [http://localhost:5173/deepseek/dashboard](http://localhost:5173/deepseek/dashboard)
- **Customer Self-Service Portal:** [http://localhost:5173/portal](http://localhost:5173/portal)

---

## 🔑 Demo Credentials

Click the quick-fill buttons on the login gate or enter manually:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **ADMIN** | `admin@brightloop.dev` | `Admin#2026` | Full platform access, tax/discount creation, AI providers |
| **STAFF** | `staff@brightloop.dev` | `Staff#2026` | Operations, subscriptions, invoices, payments (read-only plans/reports) |
| **CUSTOMER** | `customer@brightloop.dev` | `Cust#2026` | Isolated self-service customer portal (`/portal`) |

---

## 🤖 5-Model Multi-AI Architecture

The platform supports 5 AI model architectures with hot-swappable routes and isolated implementations:
1. **ChatGPT — OpenAI:** High-Contrast Swiss Grid Edition (`/chatgpt/login`)
2. **DeepSeek — DeepSeek AI:** Ultra-Dense Quantitative Terminal Edition (`/deepseek/login` & full workspace)
3. **Gemini — Google:** Kinetic Structural Brutalist Edition (`/gemini/login`)
4. **Claude — Anthropic:** Editorial Corporate Monochrome Edition (`/claude/login`)
5. **Lovable — Lovable AI:** Rapid Full-Stack Cloud Edition (`/lovable/login`)

A persistent **"ROUTE: MODEL"** badge in the top navigation bar allows live hot-swapping between UI engine labels at any time.

---

## 🛠️ Built & Tested Capabilities

- **Decimal-Safe Financial Arithmetic:** All financial totals are stored and validated in integer minor units (paise) with Indian numbering (`₹1,23,456.00`). Zero floating-point calculation drift.
- **Variant Engine with Additive Pricing:** Base Product price (₹2,000) + Odoo Brand variant (+₹560) = Final ₹2,560 live calculation.
- **Batch Recurring Billing Run:** One-click engine scans active subscriptions due for billing and generates invoices with anti-double-billing idempotency locks.
- **Subscription Finite State Machine:** `Draft → Quotation → Confirmed → Active → Closed` (with `Paused` resumable state), gated by plan permission flags.
- **Clean Brutalist Tax Invoice:** Full GSTIN compliance, printable PDF document format, and payment reconciliation.
- **AI Design Studio & Arena:** Sandboxed live preview, prompt refinement, side-by-side A/B comparison, and version approval workflow.
