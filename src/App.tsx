import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import Login from './pages/Login'
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
import ActivityLogsPage from './pages/ActivityLogsPage'
import SettingsPage from './pages/SettingsPage'
import CustomerPortalPage from './pages/CustomerPortalPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F7] font-mono text-xs text-[#746F75]">
        Verifying Brightloop security context...
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Entry Point */}
          <Route path="/login" element={<Login />} />

          {/* Customer Self-Service Portal */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <CustomerPortalPage />
              </ProtectedRoute>
            }
          />

          {/* Unified Enterprise SaaS Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
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
            <Route path="activity" element={<ActivityLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
