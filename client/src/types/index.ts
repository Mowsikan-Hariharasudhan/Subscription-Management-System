export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  customer?: Customer | null;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  companyName?: string | null;
  phone?: string | null;
  billingAddress?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  subscriptions?: Subscription[];
  invoices?: Invoice[];
  quotations?: Quotation[];
  _count?: {
    subscriptions: number;
    invoices: number;
    quotations: number;
  };
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  attributeName?: string | null;
  additionalPrice: number; // in paise
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  salesPrice: number; // paise
  costPrice: number;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  variants?: ProductVariant[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  billingFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  minimumQuantity: number;
  availableFrom?: string | null;
  availableUntil?: string | null;
  autoClose: boolean;
  allowEarlyClosure: boolean;
  allowPause: boolean;
  allowRenewal: boolean;
  isActive: boolean;
  createdAt: string;
  _count?: {
    subscriptions: number;
  };
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number; // basis points e.g. 1800 = 18%
  description?: string | null;
  isActive: boolean;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface QuotationLine {
  id: string;
  quotationId: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  taxRuleId?: string | null;
  taxRule?: TaxRule | null;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  sortOrder: number;
}

export interface Quotation {
  id: string;
  number: string;
  customerId: string;
  customer: Customer;
  planId?: string | null;
  plan?: SubscriptionPlan | null;
  templateId?: string | null;
  status: QuotationStatus;
  expiryDate?: string | null;
  paymentTerms?: string | null;
  subtotal: number;
  discountAmt: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lines: QuotationLine[];
  subscription?: { id: string; number: string; status: string } | null;
}

export interface QuotationTemplateLine {
  id: string;
  productId: string;
  product: Product;
  taxRuleId?: string | null;
  taxRule?: TaxRule | null;
  quantity: number;
  unitPrice: number;
  sortOrder: number;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  planId?: string | null;
  plan?: SubscriptionPlan | null;
  validityDays: number;
  paymentTerms?: string | null;
  isActive: boolean;
  createdAt: string;
  lines: QuotationTemplateLine[];
}

export type SubscriptionStatus =
  | 'DRAFT'
  | 'QUOTATION'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED';

export interface SubscriptionLine {
  id: string;
  subscriptionId: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  taxRuleId?: string | null;
  taxRule?: TaxRule | null;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  sortOrder: number;
}

export interface Subscription {
  id: string;
  number: string;
  customerId: string;
  customer: Customer;
  planId: string;
  plan: SubscriptionPlan;
  quotationId?: string | null;
  status: SubscriptionStatus;
  startDate: string;
  expiryDate?: string | null;
  nextBillingDate?: string | null;
  paymentTerms?: string | null;
  notes?: string | null;
  subtotal: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  lines: SubscriptionLine[];
  invoices?: Invoice[];
  _count?: {
    invoices: number;
    lines: number;
  };
}

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PAID' | 'CANCELLED';

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  taxRuleId?: string | null;
  taxRule?: TaxRule | null;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  variantPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  sortOrder: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customer: Customer;
  subscriptionId: string;
  subscription: Subscription;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discountAmt: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  outstanding: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lines: InvoiceLine[];
  payments?: Payment[];
  redemptions?: {
    id: string;
    amountApplied: number;
    discountRule: DiscountRule;
  }[];
}

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CARD' | 'OTHER';

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  createdById: string;
  createdBy?: { id: string; email: string };
  method: PaymentMethod;
  amount: number;
  paymentDate: string;
  notes?: string | null;
  createdAt: string;
}

export type DiscountType = 'FIXED' | 'PERCENTAGE';

export interface DiscountRule {
  id: string;
  name: string;
  type: DiscountType;
  value: number; // paise or basis points
  minPurchaseAmount: number;
  minQuantity: number;
  startDate?: string | null;
  endDate?: string | null;
  maxUsageCount?: number | null;
  currentUsageCount: number;
  isActive: boolean;
  createdAt: string;
  applicableProducts?: { id: string; productId: string; product: Product }[];
  _count?: { redemptions: number };
}

export interface DashboardKpis {
  activeSubscriptions: number;
  totalCustomers: number;
  collectedRevenue: number;
  totalInvoiced: number;
  outstandingAmount: number;
  overdueInvoices: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenuePaise: number;
  revenueRupees: number;
}

export interface SubscriptionGrowthItem {
  month: string;
  newSubscriptions: number;
}

export interface PaymentDistributionItem {
  status: InvoiceStatus;
  count: number;
  totalPaise: number;
  totalRupees: number;
}

