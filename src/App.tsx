/**
 * App.tsx — Brightloop AI Model Gateway & Production SaaS Architecture
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth'
import GatewayPage from './GatewayPage'
import LoginGate from './pages/LoginGate'

// Model Placeholder Login Stubs
import ChatGPTLogin from './apps/chatgpt/Login'
import DeepSeekLogin from './apps/deepseek/Login'
import GeminiLogin from './apps/gemini/Login'
import ClaudeLogin from './apps/claude/Login'
import LovableLogin from './apps/lovable/Login'

// Full-Stack Application Views
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import PlansPage from './pages/PlansPage'
import QuotationsPage from './pages/QuotationsPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import InvoicesPage from './pages/InvoicesPage'
import PaymentsPage from './pages/PaymentsPage'
import TaxRulesPage from './pages/TaxRulesPage'
import DiscountsPage from './pages/DiscountsPage'
import ReportsPage from './pages/ReportsPage'
import AiStudioPage from './pages/AiStudioPage'
import ActivityLogsPage from './pages/ActivityLogsPage'
import SettingsPage from './pages/SettingsPage'
import CustomerPortalPage from './pages/CustomerPortalPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* AI Model Selection Gateway */}
          <Route path="/" element={<GatewayPage />} />

          {/* Pixel-Perfect 50/50 Split Model Router Login Gate */}
          <Route path="/login" element={<LoginGate />} />

          {/* Model-Specific Independent Login Entry Points */}
          <Route path="/chatgpt/login" element={<ChatGPTLogin />} />
          <Route path="/deepseek/login" element={<DeepSeekLogin />} />
          <Route path="/gemini/login" element={<GeminiLogin />} />
          <Route path="/claude/login" element={<ClaudeLogin />} />
          <Route path="/lovable/login" element={<LovableLogin />} />

          {/* Isolated Customer Self-Service Portal */}
          <Route path="/portal" element={<CustomerPortalPage />} />

          {/* Core DeepSeek SaaS Workspace Shell & Modules */}
          <Route path="/deepseek" element={<AppLayout />}>
            <Route index element={<Navigate to="/deepseek/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="taxes" element={<TaxRulesPage />} />
            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="studio" element={<AiStudioPage />} />
            <Route path="activity" element={<ActivityLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Convenience Root Aliases */}
          <Route path="/dashboard" element={<Navigate to="/deepseek/dashboard" replace />} />
          <Route path="/customers" element={<Navigate to="/deepseek/customers" replace />} />
          <Route path="/products" element={<Navigate to="/deepseek/products" replace />} />
          <Route path="/plans" element={<Navigate to="/deepseek/plans" replace />} />
          <Route path="/quotations" element={<Navigate to="/deepseek/quotations" replace />} />
          <Route path="/subscriptions" element={<Navigate to="/deepseek/subscriptions" replace />} />
          <Route path="/invoices" element={<Navigate to="/deepseek/invoices" replace />} />
          <Route path="/payments" element={<Navigate to="/deepseek/payments" replace />} />
          <Route path="/reports" element={<Navigate to="/deepseek/reports" replace />} />
          <Route path="/studio" element={<Navigate to="/deepseek/studio" replace />} />
          <Route path="/activity" element={<Navigate to="/deepseek/activity" replace />} />
          <Route path="/settings" element={<Navigate to="/deepseek/settings" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
