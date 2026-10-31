import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import { AppShell } from './components/layout/AppShell';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Admin/Staff pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { Customers } from './pages/customers/Customers';
import { CustomerDetail } from './pages/customers/CustomerDetail';
import { Products } from './pages/products/Products';
import { ProductDetail } from './pages/products/ProductDetail';
import { Plans } from './pages/plans/Plans';
import { PlanDetail } from './pages/plans/PlanDetail';
import { Quotations } from './pages/quotations/Quotations';
import { QuotationDetail } from './pages/quotations/QuotationDetail';
import { QuotationTemplates } from './pages/quotations/QuotationTemplates';
import { Subscriptions } from './pages/subscriptions/Subscriptions';
import { SubscriptionDetail } from './pages/subscriptions/SubscriptionDetail';
import { Invoices } from './pages/invoices/Invoices';
import { InvoiceDetail } from './pages/invoices/InvoiceDetail';
import { Payments } from './pages/payments/Payments';
import { Discounts } from './pages/discounts/Discounts';
import { Settings } from './pages/settings/Settings';
import { TaxRules } from './pages/settings/TaxRules';
import { StaffManagement } from './pages/settings/StaffManagement';

// Customer Portal pages
import { PortalShell } from './pages/customer-portal/PortalShell';
import { CustomerDashboard } from './pages/customer-portal/CustomerDashboard';
import { ExplorePlans } from './pages/customer-portal/ExplorePlans';
import { MySubscriptions } from './pages/customer-portal/MySubscriptions';
import { MyInvoices } from './pages/customer-portal/MyInvoices';
import { MyPayments } from './pages/customer-portal/MyPayments';
import { AccountSettings } from './pages/customer-portal/AccountSettings';

// Route Guards
const RequireAuth: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-main">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-md bg-plum-deep text-white font-bold text-xl flex items-center justify-center animate-pulse">B</div>
          <p className="text-xs text-text-secondary">Loading Brightloop...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && role && !roles.includes(role)) {
    return role === 'CUSTOMER' ? <Navigate to="/portal" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const RedirectIfAuthed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    return role === 'CUSTOMER' ? <Navigate to="/portal" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
      <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin / Staff App */}
      <Route element={<RequireAuth roles={['ADMIN', 'STAFF']}><AppShell /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:id" element={<PlanDetail />} />
        <Route path="/quotation-templates" element={<QuotationTemplates />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/quotations/:id" element={<QuotationDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/taxes" element={<TaxRules />} />
        <Route path="/settings/staff" element={<RequireAuth roles={['ADMIN']}><StaffManagement /></RequireAuth>} />
      </Route>

      {/* Customer Portal */}
      <Route path="/portal" element={<RequireAuth roles={['CUSTOMER']}><PortalShell /></RequireAuth>}>
        <Route index element={<CustomerDashboard />} />
        <Route path="explore" element={<ExplorePlans />} />
        <Route path="subscriptions" element={<MySubscriptions />} />
        <Route path="invoices" element={<MyInvoices />} />
        <Route path="payments" element={<MyPayments />} />
        <Route path="account" element={<AccountSettings />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
