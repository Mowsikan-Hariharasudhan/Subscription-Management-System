// ============================================================
// BRIGHTLOOP — Seed Data
// Realistic Indian SaaS business data, INR (₹)
// All money in paise (integer). Display: divide by 100.
// ============================================================

export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER'
export type SubscriptionState = 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED'
export type InvoiceState = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED'
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'UPI' | 'OTHER'

// ---- Users ----
export interface User {
  id: string; name: string; email: string; role: Role; isActive: boolean; createdAt: string; lastLoginAt: string;
}
export const USERS: User[] = [
  { id: 'u1', name: 'Naren Selvan', email: 'admin@brightloop.dev', role: 'ADMIN', isActive: true, createdAt: '2025-01-15', lastLoginAt: '2026-10-31' },
  { id: 'u2', name: 'Divya Krishnan', email: 'staff@brightloop.dev', role: 'STAFF', isActive: true, createdAt: '2025-03-01', lastLoginAt: '2026-10-30' },
  { id: 'u3', name: 'Arjun Mehta', email: 'customer@brightloop.dev', role: 'CUSTOMER', isActive: true, createdAt: '2025-06-10', lastLoginAt: '2026-10-28' },
]

// ---- Customers ----
export interface Customer {
  id: string; code: string; name: string; email: string; phone: string; company: string;
  city: string; gstin: string; status: 'ACTIVE' | 'INACTIVE'; createdAt: string;
}
export const CUSTOMERS: Customer[] = [
  { id: 'c1',  code: 'CUS-001', name: 'Rajesh Kumar',    email: 'rajesh@zoho.com',       phone: '9840123456', company: 'Zoho Corp India',       city: 'Chennai',   gstin: '33AABCZ1234A1Z5', status: 'ACTIVE',   createdAt: '2025-02-10' },
  { id: 'c2',  code: 'CUS-002', name: 'Priya Sharma',    email: 'priya@freshworks.com',   phone: '9900234567', company: 'Freshworks Chennai',    city: 'Chennai',   gstin: '33AABCF5678B2Z6', status: 'ACTIVE',   createdAt: '2025-02-18' },
  { id: 'c3',  code: 'CUS-003', name: 'Vikram Singh',    email: 'vikram@razorpay.com',    phone: '9811345678', company: 'Razorpay Tech',         city: 'Bengaluru', gstin: '29AABCR9012C3Z7', status: 'ACTIVE',   createdAt: '2025-03-05' },
  { id: 'c4',  code: 'CUS-004', name: 'Anitha Reddy',    email: 'anitha@zerodha.com',     phone: '9922456789', company: 'Zerodha Broking',       city: 'Bengaluru', gstin: '29AABCZ3456D4Z8', status: 'ACTIVE',   createdAt: '2025-03-22' },
  { id: 'c5',  code: 'CUS-005', name: 'Karthik Nair',    email: 'karthik@swiggy.com',     phone: '9844567890', company: 'Swiggy Enterprise',     city: 'Bengaluru', gstin: '29AABCS7890E5Z9', status: 'ACTIVE',   createdAt: '2025-04-01' },
  { id: 'c6',  code: 'CUS-006', name: 'Meera Pillai',    email: 'meera@nykaa.com',        phone: '9833678901', company: 'Nykaa Retail',          city: 'Mumbai',    gstin: '27AABCN2345F6Z0', status: 'ACTIVE',   createdAt: '2025-04-15' },
  { id: 'c7',  code: 'CUS-007', name: 'Suresh Patel',    email: 'suresh@lntinfo.com',     phone: '9766789012', company: 'L&T Infotech',          city: 'Mumbai',    gstin: '27AABCL6789G7Z1', status: 'ACTIVE',   createdAt: '2025-04-28' },
  { id: 'c8',  code: 'CUS-008', name: 'Lakshmi Iyer',    email: 'lakshmi@infosys.com',    phone: '9755890123', company: 'Infosys Ltd',           city: 'Bengaluru', gstin: '29AABCI0123H8Z2', status: 'ACTIVE',   createdAt: '2025-05-10' },
  { id: 'c9',  code: 'CUS-009', name: 'Arun Chakraborty',email: 'arun@wipro.com',         phone: '9866901234', company: 'Wipro Technologies',    city: 'Bengaluru', gstin: '29AABCW4567I9Z3', status: 'ACTIVE',   createdAt: '2025-05-20' },
  { id: 'c10', code: 'CUS-010', name: 'Deepa Menon',     email: 'deepa@tcs.com',          phone: '9944012345', company: 'TCS Mumbai',            city: 'Mumbai',    gstin: '27AABCT8901J0Z4', status: 'ACTIVE',   createdAt: '2025-06-01' },
  { id: 'c11', code: 'CUS-011', name: 'Ravi Verma',      email: 'ravi@hdfc.com',          phone: '9977123456', company: 'HDFC Securities',       city: 'Mumbai',    gstin: '27AABCH3456K1Z5', status: 'ACTIVE',   createdAt: '2025-06-15' },
  { id: 'c12', code: 'CUS-012', name: 'Pooja Joshi',     email: 'pooja@byju.com',         phone: '9788234567', company: 'BYJU\'s Learning',     city: 'Bengaluru', gstin: '29AABCB7890L2Z6', status: 'ACTIVE',   createdAt: '2025-07-01' },
  { id: 'c13', code: 'CUS-013', name: 'Sathish Babu',    email: 'sathish@ola.com',        phone: '9833345678', company: 'Ola Electric',          city: 'Bengaluru', gstin: '29AABCO2345M3Z7', status: 'ACTIVE',   createdAt: '2025-07-12' },
  { id: 'c14', code: 'CUS-014', name: 'Nandini Rao',     email: 'nandini@paytm.com',      phone: '9922456780', company: 'Paytm Payments',        city: 'Noida',     gstin: '09AABCP6789N4Z8', status: 'ACTIVE',   createdAt: '2025-07-25' },
  { id: 'c15', code: 'CUS-015', name: 'Manoj Tiwari',    email: 'manoj@flipkart.com',     phone: '9811567891', company: 'Flipkart Internet',     city: 'Bengaluru', gstin: '29AABCF1234O5Z9', status: 'ACTIVE',   createdAt: '2025-08-05' },
  { id: 'c16', code: 'CUS-016', name: 'Geetha Sundaram', email: 'geetha@hcl.com',         phone: '9844678902', company: 'HCL Technologies',      city: 'Noida',     gstin: '09AABCH5678P6Z0', status: 'ACTIVE',   createdAt: '2025-08-18' },
  { id: 'c17', code: 'CUS-017', name: 'Balaji Krishnan', email: 'balaji@zomato.com',      phone: '9766789013', company: 'Zomato Ltd',            city: 'Gurugram',  gstin: '06AABCZ0123Q7Z1', status: 'ACTIVE',   createdAt: '2025-09-01' },
  { id: 'c18', code: 'CUS-018', name: 'Kavitha Ramesh',  email: 'kavitha@myntra.com',     phone: '9755890124', company: 'Myntra Designs',        city: 'Bengaluru', gstin: '29AABCM4567R8Z2', status: 'ACTIVE',   createdAt: '2025-09-15' },
  { id: 'c19', code: 'CUS-019', name: 'Senthil Kumar',   email: 'senthil@cred.com',       phone: '9866901235', company: 'CRED Fintech',          city: 'Bengaluru', gstin: '29AABCC8901S9Z3', status: 'ACTIVE',   createdAt: '2025-09-28' },
  { id: 'c20', code: 'CUS-020', name: 'Uma Krishnamurthy',email: 'uma@meesho.com',         phone: '9944012346', company: 'Meesho Supply',         city: 'Bengaluru', gstin: '29AABCM3456T0Z4', status: 'ACTIVE',   createdAt: '2025-10-10' },
  { id: 'c21', code: 'CUS-021', name: 'Prakash Gupta',   email: 'prakash@policybazaar.com',phone: '9977123457', company: 'PolicyBazaar',         city: 'Gurugram',  gstin: '06AABCP7890U1Z5', status: 'INACTIVE', createdAt: '2025-10-22' },
  { id: 'c22', code: 'CUS-022', name: 'Sumitha Iyer',    email: 'sumitha@cleartax.com',   phone: '9788234568', company: 'ClearTax India',        city: 'Bengaluru', gstin: '29AABCC2345V2Z6', status: 'ACTIVE',   createdAt: '2025-11-05' },
  { id: 'c23', code: 'CUS-023', name: 'Mohan Raj',       email: 'mohan@udaan.com',        phone: '9833345679', company: 'Udaan B2B',             city: 'Bengaluru', gstin: '29AABCU6789W3Z7', status: 'ACTIVE',   createdAt: '2025-11-18' },
  { id: 'c24', code: 'CUS-024', name: 'Janaki Raman',    email: 'janaki@dunzo.com',       phone: '9922456781', company: 'Dunzo Digital',         city: 'Bengaluru', gstin: '29AABCD1234X4Z8', status: 'ACTIVE',   createdAt: '2025-12-01' },
  { id: 'c25', code: 'CUS-025', name: 'Thilaga Devi',    email: 'thilaga@sharechat.com',  phone: '9811567892', company: 'ShareChat Media',       city: 'Bengaluru', gstin: '29AABCS5678Y5Z9', status: 'ACTIVE',   createdAt: '2025-12-15' },
  { id: 'c26', code: 'CUS-026', name: 'Raghu Venkatesh', email: 'raghu@dreamworks.com',   phone: '9844678903', company: 'DreamWorks India',      city: 'Hyderabad', gstin: '36AABCD0123Z6Z0', status: 'ACTIVE',   createdAt: '2026-01-08' },
  { id: 'c27', code: 'CUS-027', name: 'Saraswathi Rajan',email: 'saraswathi@mphasis.com', phone: '9766789014', company: 'Mphasis Ltd',           city: 'Bengaluru', gstin: '29AABCM4567A7Z1', status: 'ACTIVE',   createdAt: '2026-01-22' },
  { id: 'c28', code: 'CUS-028', name: 'Harish Babu',     email: 'harish@hexaware.com',    phone: '9755890125', company: 'Hexaware Tech',         city: 'Chennai',   gstin: '33AABCH8901B8Z2', status: 'INACTIVE', createdAt: '2026-02-10' },
  { id: 'c29', code: 'CUS-029', name: 'Vidya Subramanian',email: 'vidya@cognizant.com',   phone: '9866901236', company: 'Cognizant India',       city: 'Chennai',   gstin: '33AABCC3456C9Z3', status: 'ACTIVE',   createdAt: '2026-03-01' },
  { id: 'c30', code: 'CUS-030', name: 'Kamala Sekar',    email: 'kamala@amazon.com',      phone: '9944012347', company: 'Amazon India',          city: 'Hyderabad', gstin: '36AABCA7890D0Z4', status: 'ACTIVE',   createdAt: '2026-04-15' },
]

// ---- Products ----
export interface ProductVariant { id: string; name: string; priceDelta: number; isActive: boolean; }
export interface Product {
  id: string; code: string; name: string; type: string;
  salesPrice: number; costPrice: number; description: string;
  isActive: boolean; variants: ProductVariant[]; createdAt: string;
}
export const PRODUCTS: Product[] = [
  {
    id: 'p1', code: 'PRD-001', name: 'Brightloop ERP Core', type: 'Software', salesPrice: 200000, costPrice: 80000,
    description: 'Core ERP subscription with modules for finance, inventory, and HR.',
    isActive: true, createdAt: '2025-01-01',
    variants: [
      { id: 'pv1', name: 'Standard Edition', priceDelta: 0,     isActive: true },
      { id: 'pv2', name: 'Odoo Brand',       priceDelta: 56000, isActive: true },
      { id: 'pv3', name: 'Enterprise Plus',  priceDelta: 120000,isActive: true },
    ],
  },
  {
    id: 'p2', code: 'PRD-002', name: 'Payroll Pro', type: 'Software', salesPrice: 80000, costPrice: 30000,
    description: 'Automated payroll processing with statutory compliance.', isActive: true, createdAt: '2025-01-01',
    variants: [
      { id: 'pv4', name: 'Basic (≤50 employees)',   priceDelta: 0,     isActive: true },
      { id: 'pv5', name: 'Growth (≤200 employees)', priceDelta: 40000, isActive: true },
    ],
  },
  {
    id: 'p3', code: 'PRD-003', name: 'Analytics Dashboard', type: 'Software', salesPrice: 60000, costPrice: 20000,
    description: 'Real-time business intelligence and reporting.', isActive: true, createdAt: '2025-01-01',
    variants: [],
  },
  {
    id: 'p4', code: 'PRD-004', name: 'API Gateway', type: 'Infrastructure', salesPrice: 30000, costPrice: 10000,
    description: 'Secure API management and rate limiting.', isActive: true, createdAt: '2025-02-01',
    variants: [
      { id: 'pv6', name: '1M calls/mo',  priceDelta: 0,     isActive: true },
      { id: 'pv7', name: '10M calls/mo', priceDelta: 25000, isActive: true },
    ],
  },
  {
    id: 'p5', code: 'PRD-005', name: 'Customer Portal', type: 'Software', salesPrice: 25000, costPrice: 8000,
    description: 'White-label customer self-service portal.', isActive: true, createdAt: '2025-02-01',
    variants: [],
  },
  {
    id: 'p6', code: 'PRD-006', name: 'GST Filing Suite', type: 'Compliance', salesPrice: 40000, costPrice: 15000,
    description: 'Automated GST return filing and reconciliation.', isActive: true, createdAt: '2025-03-01',
    variants: [
      { id: 'pv8', name: 'GSTR-1 only',     priceDelta: 0,     isActive: true },
      { id: 'pv9', name: 'Full Compliance',  priceDelta: 20000, isActive: true },
    ],
  },
  {
    id: 'p7', code: 'PRD-007', name: 'HR Management Suite', type: 'Software', salesPrice: 70000, costPrice: 28000,
    description: 'Leave, attendance, performance and appraisal management.', isActive: true, createdAt: '2025-04-01',
    variants: [],
  },
  {
    id: 'p8', code: 'PRD-008', name: 'Inventory Manager', type: 'Software', salesPrice: 55000, costPrice: 22000,
    description: 'Multi-warehouse inventory with barcode scanning.', isActive: true, createdAt: '2025-04-01',
    variants: [
      { id: 'pv10', name: 'Single warehouse', priceDelta: 0,     isActive: true },
      { id: 'pv11', name: 'Multi warehouse',  priceDelta: 30000, isActive: true },
    ],
  },
  {
    id: 'p9', code: 'PRD-009', name: 'CRM Lite', type: 'Software', salesPrice: 35000, costPrice: 12000,
    description: 'Lead management, pipeline and deal tracking.', isActive: true, createdAt: '2025-05-01',
    variants: [],
  },
  {
    id: 'p10', code: 'PRD-010', name: 'E-invoice Integration', type: 'Compliance', salesPrice: 20000, costPrice: 6000,
    description: 'Direct IRP integration for e-invoice generation.', isActive: true, createdAt: '2025-06-01',
    variants: [],
  },
  {
    id: 'p11', code: 'PRD-011', name: 'Document Management', type: 'Software', salesPrice: 30000, costPrice: 10000,
    description: 'Cloud document storage with version control.', isActive: false, createdAt: '2025-07-01',
    variants: [],
  },
  {
    id: 'p12', code: 'PRD-012', name: 'Support Desk', type: 'Software', salesPrice: 45000, costPrice: 18000,
    description: 'Ticketing, SLA tracking and customer support portal.', isActive: true, createdAt: '2025-08-01',
    variants: [
      { id: 'pv12', name: 'Starter (≤3 agents)', priceDelta: 0,     isActive: true },
      { id: 'pv13', name: 'Pro (unlimited agents)',priceDelta: 30000, isActive: true },
    ],
  },
]

// ---- Plans ----
export interface Plan {
  id: string; code: string; name: string; productId: string;
  price: number; billingPeriod: 'D' | 'W' | 'M' | 'Y';
  minQuantity: number; availableFrom: string; availableTo: string;
  autoCloseOnEnd: boolean; allowEarlyClose: boolean; allowPause: boolean; allowRenew: boolean;
  isActive: boolean;
}
export const PLANS: Plan[] = [
  { id: 'pl1',  code: 'PLN-001', name: 'ERP Monthly',        productId: 'p1',  price: 200000, billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-01-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl2',  code: 'PLN-002', name: 'ERP Annual',         productId: 'p1',  price: 2160000,billingPeriod: 'Y', minQuantity: 1,  availableFrom: '2025-01-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: false, allowRenew: true,  isActive: true  },
  { id: 'pl3',  code: 'PLN-003', name: 'Payroll Monthly',    productId: 'p2',  price: 80000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-01-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl4',  code: 'PLN-004', name: 'Payroll Annual',     productId: 'p2',  price: 864000, billingPeriod: 'Y', minQuantity: 1,  availableFrom: '2025-01-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: false, allowPause: false, allowRenew: true,  isActive: true  },
  { id: 'pl5',  code: 'PLN-005', name: 'Analytics Monthly',  productId: 'p3',  price: 60000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-01-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl6',  code: 'PLN-006', name: 'API Gateway Monthly',productId: 'p4',  price: 30000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-02-01', availableTo: '2027-12-31', autoCloseOnEnd: true,  allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl7',  code: 'PLN-007', name: 'API Gateway Annual', productId: 'p4',  price: 324000, billingPeriod: 'Y', minQuantity: 1,  availableFrom: '2025-02-01', availableTo: '2027-12-31', autoCloseOnEnd: true,  allowEarlyClose: false, allowPause: false, allowRenew: true,  isActive: true  },
  { id: 'pl8',  code: 'PLN-008', name: 'GST Suite Monthly',  productId: 'p6',  price: 40000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-03-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: false, allowRenew: true,  isActive: true  },
  { id: 'pl9',  code: 'PLN-009', name: 'HR Suite Monthly',   productId: 'p7',  price: 70000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-04-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl10', code: 'PLN-010', name: 'HR Suite Annual',    productId: 'p7',  price: 756000, billingPeriod: 'Y', minQuantity: 1,  availableFrom: '2025-04-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: false, allowPause: false, allowRenew: true,  isActive: true  },
  { id: 'pl11', code: 'PLN-011', name: 'Inventory Monthly',  productId: 'p8',  price: 55000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-04-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl12', code: 'PLN-012', name: 'CRM Lite Weekly',    productId: 'p9',  price: 9000,   billingPeriod: 'W', minQuantity: 1,  availableFrom: '2025-05-01', availableTo: '2026-12-31', autoCloseOnEnd: true,  allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl13', code: 'PLN-013', name: 'CRM Lite Monthly',   productId: 'p9',  price: 35000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-05-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl14', code: 'PLN-014', name: 'Support Desk Monthly',productId: 'p12',price: 45000,  billingPeriod: 'M', minQuantity: 1,  availableFrom: '2025-08-01', availableTo: '2027-12-31', autoCloseOnEnd: false, allowEarlyClose: true,  allowPause: true,  allowRenew: true,  isActive: true  },
  { id: 'pl15', code: 'PLN-015', name: 'ERP Daily Trial',    productId: 'p1',  price: 7500,   billingPeriod: 'D', minQuantity: 1,  availableFrom: '2026-01-01', availableTo: '2026-12-31', autoCloseOnEnd: true,  allowEarlyClose: true,  allowPause: false, allowRenew: false, isActive: true  },
]

// ---- Tax Rules ----
export interface TaxRule {
  id: string; name: string; rate: number; type: string;
  applicableProducts: string[]; effectiveFrom: string; effectiveTo: string; isActive: boolean;
}
export const TAX_RULES: TaxRule[] = [
  { id: 'tx1', name: 'IGST 18%',        rate: 18, type: 'IGST',    applicableProducts: ['p1','p2','p3','p4','p5'],   effectiveFrom: '2025-01-01', effectiveTo: '2027-12-31', isActive: true  },
  { id: 'tx2', name: 'IGST 12%',        rate: 12, type: 'IGST',    applicableProducts: ['p6','p8','p10'],           effectiveFrom: '2025-01-01', effectiveTo: '2027-12-31', isActive: true  },
  { id: 'tx3', name: 'CGST+SGST 18%',  rate: 18, type: 'GST',     applicableProducts: ['p7','p9','p11','p12'],     effectiveFrom: '2025-01-01', effectiveTo: '2027-12-31', isActive: true  },
  { id: 'tx4', name: 'IGST 5%',         rate: 5,  type: 'IGST',    applicableProducts: [],                          effectiveFrom: '2025-01-01', effectiveTo: '2025-12-31', isActive: false },
  { id: 'tx5', name: 'IGST 28%',        rate: 28, type: 'IGST',    applicableProducts: [],                          effectiveFrom: '2025-01-01', effectiveTo: '2027-12-31', isActive: true  },
]

// ---- Discounts ----
export interface Discount {
  id: string; name: string; type: 'FIXED' | 'PERCENT'; value: number;
  minPurchaseAmount?: number; minQuantity?: number;
  startsAt: string; endsAt: string; maxRedemptions: number; timesUsed: number;
  scope: 'PRODUCTS' | 'SUBSCRIPTION'; productIds: string[]; isActive: boolean;
}
export const DISCOUNTS: Discount[] = [
  { id: 'd1', name: 'Annual Commit Discount', type: 'FIXED',   value: 500000, minPurchaseAmount: 2000000, minQuantity: 1, startsAt: '2025-01-01', endsAt: '2026-12-31', maxRedemptions: 100, timesUsed: 38, scope: 'SUBSCRIPTION', productIds: [], isActive: true  },
  { id: 'd2', name: 'Seat Volume 15% Off',    type: 'PERCENT', value: 15,     minPurchaseAmount: 0,       minQuantity: 5, startsAt: '2025-01-01', endsAt: '2026-12-31', maxRedemptions: 200, timesUsed: 62, scope: 'PRODUCTS',      productIds: ['p1','p2'], isActive: true  },
  { id: 'd3', name: 'New Customer 10% Off',   type: 'PERCENT', value: 10,     minPurchaseAmount: 500000,  minQuantity: 1, startsAt: '2025-06-01', endsAt: '2026-06-30', maxRedemptions: 50,  timesUsed: 28, scope: 'SUBSCRIPTION', productIds: [], isActive: true  },
  { id: 'd4', name: 'Startup Flat ₹2000 Off', type: 'FIXED',   value: 200000, minPurchaseAmount: 1000000, minQuantity: 1, startsAt: '2025-01-01', endsAt: '2025-12-31', maxRedemptions: 30,  timesUsed: 30, scope: 'SUBSCRIPTION', productIds: [], isActive: false },
  { id: 'd5', name: 'GST Suite Bundle',       type: 'PERCENT', value: 20,     minPurchaseAmount: 0,       minQuantity: 1, startsAt: '2025-03-01', endsAt: '2025-09-30', maxRedemptions: 40,  timesUsed: 40, scope: 'PRODUCTS',      productIds: ['p6'], isActive: false },
  { id: 'd6', name: 'Q4 Year-End 5% Off',     type: 'PERCENT', value: 5,      minPurchaseAmount: 0,       minQuantity: 1, startsAt: '2026-10-01', endsAt: '2026-12-31', maxRedemptions: 999, timesUsed: 12, scope: 'SUBSCRIPTION', productIds: [], isActive: true  },
]

// ---- Subscriptions ----
export interface Subscription {
  id: string; number: string; customerId: string; planId: string;
  state: SubscriptionState; startDate: string; expiryDate: string;
  nextBillingAt: string; totalAmount: number; mrr: number; createdAt: string;
}
export const SUBSCRIPTIONS: Subscription[] = [
  { id: 's1',  number: 'SUB-2025-000001', customerId: 'c1',  planId: 'pl1',  state: 'ACTIVE',    startDate: '2025-02-10', expiryDate: '2026-02-10', nextBillingAt: '2026-11-10', totalAmount: 236000, mrr: 236000, createdAt: '2025-02-10' },
  { id: 's2',  number: 'SUB-2025-000002', customerId: 'c1',  planId: 'pl5',  state: 'ACTIVE',    startDate: '2025-06-01', expiryDate: '2026-06-01', nextBillingAt: '2026-11-01', totalAmount: 70800,  mrr: 70800,  createdAt: '2025-06-01' },
  { id: 's3',  number: 'SUB-2025-000003', customerId: 'c2',  planId: 'pl2',  state: 'ACTIVE',    startDate: '2025-03-01', expiryDate: '2026-03-01', nextBillingAt: '2026-03-01', totalAmount: 2548800,mrr: 212400, createdAt: '2025-03-01' },
  { id: 's4',  number: 'SUB-2025-000004', customerId: 'c3',  planId: 'pl3',  state: 'ACTIVE',    startDate: '2025-04-01', expiryDate: '2026-04-01', nextBillingAt: '2026-11-01', totalAmount: 94400,  mrr: 94400,  createdAt: '2025-04-01' },
  { id: 's5',  number: 'SUB-2025-000005', customerId: 'c3',  planId: 'pl6',  state: 'ACTIVE',    startDate: '2025-05-01', expiryDate: '2026-05-01', nextBillingAt: '2026-11-01', totalAmount: 35400,  mrr: 35400,  createdAt: '2025-05-01' },
  { id: 's6',  number: 'SUB-2025-000006', customerId: 'c4',  planId: 'pl9',  state: 'ACTIVE',    startDate: '2025-05-15', expiryDate: '2026-05-15', nextBillingAt: '2026-11-15', totalAmount: 82600,  mrr: 82600,  createdAt: '2025-05-15' },
  { id: 's7',  number: 'SUB-2025-000007', customerId: 'c5',  planId: 'pl1',  state: 'PAUSED',    startDate: '2025-06-01', expiryDate: '2026-06-01', nextBillingAt: '2026-11-01', totalAmount: 236000, mrr: 0,      createdAt: '2025-06-01' },
  { id: 's8',  number: 'SUB-2025-000008', customerId: 'c6',  planId: 'pl11', state: 'ACTIVE',    startDate: '2025-07-01', expiryDate: '2026-07-01', nextBillingAt: '2026-11-01', totalAmount: 64900,  mrr: 64900,  createdAt: '2025-07-01' },
  { id: 's9',  number: 'SUB-2025-000009', customerId: 'c7',  planId: 'pl14', state: 'ACTIVE',    startDate: '2025-08-01', expiryDate: '2026-08-01', nextBillingAt: '2026-11-01', totalAmount: 53100,  mrr: 53100,  createdAt: '2025-08-01' },
  { id: 's10', number: 'SUB-2025-000010', customerId: 'c8',  planId: 'pl4',  state: 'ACTIVE',    startDate: '2025-09-01', expiryDate: '2026-09-01', nextBillingAt: '2026-09-01', totalAmount: 1019520,mrr: 84960,  createdAt: '2025-09-01' },
  { id: 's11', number: 'SUB-2025-000011', customerId: 'c9',  planId: 'pl13', state: 'ACTIVE',    startDate: '2025-10-01', expiryDate: '2026-10-01', nextBillingAt: '2026-11-01', totalAmount: 41300,  mrr: 41300,  createdAt: '2025-10-01' },
  { id: 's12', number: 'SUB-2025-000012', customerId: 'c10', planId: 'pl8',  state: 'ACTIVE',    startDate: '2025-10-15', expiryDate: '2026-10-15', nextBillingAt: '2026-11-15', totalAmount: 44800,  mrr: 44800,  createdAt: '2025-10-15' },
  { id: 's13', number: 'SUB-2025-000013', customerId: 'c11', planId: 'pl1',  state: 'ACTIVE',    startDate: '2025-11-01', expiryDate: '2026-11-01', nextBillingAt: '2026-11-01', totalAmount: 236000, mrr: 236000, createdAt: '2025-11-01' },
  { id: 's14', number: 'SUB-2025-000014', customerId: 'c12', planId: 'pl9',  state: 'ACTIVE',    startDate: '2025-11-15', expiryDate: '2026-11-15', nextBillingAt: '2026-11-15', totalAmount: 82600,  mrr: 82600,  createdAt: '2025-11-15' },
  { id: 's15', number: 'SUB-2025-000015', customerId: 'c13', planId: 'pl3',  state: 'CLOSED',    startDate: '2025-01-01', expiryDate: '2025-12-31', nextBillingAt: '2026-01-01', totalAmount: 94400,  mrr: 0,      createdAt: '2025-01-01' },
  { id: 's16', number: 'SUB-2025-000016', customerId: 'c14', planId: 'pl5',  state: 'CLOSED',    startDate: '2025-02-01', expiryDate: '2025-08-01', nextBillingAt: '2025-09-01', totalAmount: 70800,  mrr: 0,      createdAt: '2025-02-01' },
  { id: 's17', number: 'SUB-2025-000017', customerId: 'c15', planId: 'pl6',  state: 'EXPIRED',   startDate: '2025-01-01', expiryDate: '2026-01-01', nextBillingAt: '2026-01-01', totalAmount: 35400,  mrr: 0,      createdAt: '2025-01-01' },
  { id: 's18', number: 'SUB-2026-000018', customerId: 'c16', planId: 'pl1',  state: 'ACTIVE',    startDate: '2026-01-01', expiryDate: '2027-01-01', nextBillingAt: '2026-12-01', totalAmount: 236000, mrr: 236000, createdAt: '2026-01-01' },
  { id: 's19', number: 'SUB-2026-000019', customerId: 'c17', planId: 'pl10', state: 'ACTIVE',    startDate: '2026-02-01', expiryDate: '2027-02-01', nextBillingAt: '2027-02-01', totalAmount: 892080, mrr: 74340,  createdAt: '2026-02-01' },
  { id: 's20', number: 'SUB-2026-000020', customerId: 'c18', planId: 'pl11', state: 'ACTIVE',    startDate: '2026-03-01', expiryDate: '2027-03-01', nextBillingAt: '2026-12-01', totalAmount: 64900,  mrr: 64900,  createdAt: '2026-03-01' },
  { id: 's21', number: 'SUB-2026-000021', customerId: 'c19', planId: 'pl14', state: 'CONFIRMED', startDate: '2026-11-01', expiryDate: '2027-11-01', nextBillingAt: '2026-11-01', totalAmount: 53100,  mrr: 53100,  createdAt: '2026-10-25' },
  { id: 's22', number: 'SUB-2026-000022', customerId: 'c20', planId: 'pl13', state: 'QUOTATION', startDate: '2026-11-01', expiryDate: '2027-11-01', nextBillingAt: '2026-11-01', totalAmount: 41300,  mrr: 41300,  createdAt: '2026-10-28' },
  { id: 's23', number: 'SUB-2026-000023', customerId: 'c22', planId: 'pl1',  state: 'DRAFT',     startDate: '2026-11-15', expiryDate: '2027-11-15', nextBillingAt: '2026-11-15', totalAmount: 236000, mrr: 236000, createdAt: '2026-10-30' },
  { id: 's24', number: 'SUB-2026-000024', customerId: 'c23', planId: 'pl5',  state: 'ACTIVE',    startDate: '2026-04-01', expiryDate: '2027-04-01', nextBillingAt: '2026-12-01', totalAmount: 70800,  mrr: 70800,  createdAt: '2026-04-01' },
  { id: 's25', number: 'SUB-2026-000025', customerId: 'c24', planId: 'pl8',  state: 'ACTIVE',    startDate: '2026-05-01', expiryDate: '2027-05-01', nextBillingAt: '2026-12-01', totalAmount: 44800,  mrr: 44800,  createdAt: '2026-05-01' },
  { id: 's26', number: 'SUB-2026-000026', customerId: 'c25', planId: 'pl9',  state: 'ACTIVE',    startDate: '2026-06-01', expiryDate: '2027-06-01', nextBillingAt: '2026-12-01', totalAmount: 82600,  mrr: 82600,  createdAt: '2026-06-01' },
  { id: 's27', number: 'SUB-2026-000027', customerId: 'c26', planId: 'pl7',  state: 'ACTIVE',    startDate: '2026-06-15', expiryDate: '2027-06-15', nextBillingAt: '2027-06-15', totalAmount: 382320, mrr: 31860,  createdAt: '2026-06-15' },
  { id: 's28', number: 'SUB-2026-000028', customerId: 'c27', planId: 'pl3',  state: 'ACTIVE',    startDate: '2026-07-01', expiryDate: '2027-07-01', nextBillingAt: '2026-12-01', totalAmount: 94400,  mrr: 94400,  createdAt: '2026-07-01' },
  { id: 's29', number: 'SUB-2026-000029', customerId: 'c29', planId: 'pl14', state: 'ACTIVE',    startDate: '2026-08-01', expiryDate: '2027-08-01', nextBillingAt: '2026-12-01', totalAmount: 53100,  mrr: 53100,  createdAt: '2026-08-01' },
  { id: 's30', number: 'SUB-2026-000030', customerId: 'c30', planId: 'pl15', state: 'ACTIVE',    startDate: '2026-10-01', expiryDate: '2026-12-31', nextBillingAt: '2026-11-01', totalAmount: 8850,   mrr: 8850,   createdAt: '2026-10-01' },
]

// ---- Invoices ----
export interface Invoice {
  id: string; number: string; subscriptionId: string; customerId: string;
  state: InvoiceState; issueDate: string; dueDate: string;
  periodStart: string; periodEnd: string;
  subtotal: number; taxTotal: number; discountTotal: number; total: number;
  amountPaid: number; currency: string;
}
export const INVOICES: Invoice[] = [
  { id: 'inv1',  number: 'INV-2025-000001', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2025-02-10', dueDate: '2025-02-25', periodStart: '2025-02-10', periodEnd: '2025-03-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv2',  number: 'INV-2025-000002', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2025-03-10', dueDate: '2025-03-25', periodStart: '2025-03-10', periodEnd: '2025-04-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv3',  number: 'INV-2025-000003', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2025-04-10', dueDate: '2025-04-25', periodStart: '2025-04-10', periodEnd: '2025-05-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv4',  number: 'INV-2025-000004', subscriptionId: 's3',  customerId: 'c2',  state: 'PAID',           issueDate: '2025-03-01', dueDate: '2025-04-01', periodStart: '2025-03-01', periodEnd: '2026-03-01', subtotal: 2160000,taxTotal: 388800,discountTotal: 500000,total: 2048800,amountPaid: 2048800,currency: 'INR' },
  { id: 'inv5',  number: 'INV-2025-000005', subscriptionId: 's4',  customerId: 'c3',  state: 'PAID',           issueDate: '2025-04-01', dueDate: '2025-04-16', periodStart: '2025-04-01', periodEnd: '2025-05-01', subtotal: 80000,  taxTotal: 14400, discountTotal: 0,     total: 94400,  amountPaid: 94400,  currency: 'INR' },
  { id: 'inv6',  number: 'INV-2025-000006', subscriptionId: 's4',  customerId: 'c3',  state: 'PAID',           issueDate: '2025-05-01', dueDate: '2025-05-16', periodStart: '2025-05-01', periodEnd: '2025-06-01', subtotal: 80000,  taxTotal: 14400, discountTotal: 0,     total: 94400,  amountPaid: 94400,  currency: 'INR' },
  { id: 'inv7',  number: 'INV-2025-000007', subscriptionId: 's6',  customerId: 'c4',  state: 'PAID',           issueDate: '2025-05-15', dueDate: '2025-05-30', periodStart: '2025-05-15', periodEnd: '2025-06-15', subtotal: 70000,  taxTotal: 12600, discountTotal: 0,     total: 82600,  amountPaid: 82600,  currency: 'INR' },
  { id: 'inv8',  number: 'INV-2025-000008', subscriptionId: 's8',  customerId: 'c6',  state: 'PAID',           issueDate: '2025-07-01', dueDate: '2025-07-16', periodStart: '2025-07-01', periodEnd: '2025-08-01', subtotal: 55000,  taxTotal: 9900,  discountTotal: 0,     total: 64900,  amountPaid: 64900,  currency: 'INR' },
  { id: 'inv9',  number: 'INV-2025-000009', subscriptionId: 's9',  customerId: 'c7',  state: 'PAID',           issueDate: '2025-08-01', dueDate: '2025-08-16', periodStart: '2025-08-01', periodEnd: '2025-09-01', subtotal: 45000,  taxTotal: 8100,  discountTotal: 0,     total: 53100,  amountPaid: 53100,  currency: 'INR' },
  { id: 'inv10', number: 'INV-2025-000010', subscriptionId: 's10', customerId: 'c8',  state: 'PAID',           issueDate: '2025-09-01', dueDate: '2026-09-01', periodStart: '2025-09-01', periodEnd: '2026-09-01', subtotal: 864000, taxTotal: 155520,discountTotal: 0,     total: 1019520,amountPaid: 1019520,currency: 'INR' },
  { id: 'inv11', number: 'INV-2025-000011', subscriptionId: 's11', customerId: 'c9',  state: 'PAID',           issueDate: '2025-10-01', dueDate: '2025-10-16', periodStart: '2025-10-01', periodEnd: '2025-11-01', subtotal: 35000,  taxTotal: 6300,  discountTotal: 0,     total: 41300,  amountPaid: 41300,  currency: 'INR' },
  { id: 'inv12', number: 'INV-2025-000012', subscriptionId: 's12', customerId: 'c10', state: 'OVERDUE',        issueDate: '2025-10-15', dueDate: '2025-10-30', periodStart: '2025-10-15', periodEnd: '2025-11-15', subtotal: 40000,  taxTotal: 4800,  discountTotal: 0,     total: 44800,  amountPaid: 0,      currency: 'INR' },
  { id: 'inv13', number: 'INV-2025-000013', subscriptionId: 's13', customerId: 'c11', state: 'OVERDUE',        issueDate: '2025-11-01', dueDate: '2025-11-16', periodStart: '2025-11-01', periodEnd: '2025-12-01', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 0,      currency: 'INR' },
  { id: 'inv14', number: 'INV-2025-000014', subscriptionId: 's14', customerId: 'c12', state: 'PARTIALLY_PAID', issueDate: '2025-11-15', dueDate: '2025-11-30', periodStart: '2025-11-15', periodEnd: '2025-12-15', subtotal: 70000,  taxTotal: 12600, discountTotal: 0,     total: 82600,  amountPaid: 40000,  currency: 'INR' },
  { id: 'inv15', number: 'INV-2025-000015', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2025-12-10', dueDate: '2025-12-25', periodStart: '2025-12-10', periodEnd: '2026-01-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv16', number: 'INV-2026-000016', subscriptionId: 's18', customerId: 'c16', state: 'PAID',           issueDate: '2026-01-01', dueDate: '2026-01-16', periodStart: '2026-01-01', periodEnd: '2026-02-01', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv17', number: 'INV-2026-000017', subscriptionId: 's19', customerId: 'c17', state: 'PAID',           issueDate: '2026-02-01', dueDate: '2027-02-01', periodStart: '2026-02-01', periodEnd: '2027-02-01', subtotal: 756000, taxTotal: 136080,discountTotal: 0,     total: 892080, amountPaid: 892080, currency: 'INR' },
  { id: 'inv18', number: 'INV-2026-000018', subscriptionId: 's24', customerId: 'c23', state: 'PAID',           issueDate: '2026-04-01', dueDate: '2026-04-16', periodStart: '2026-04-01', periodEnd: '2026-05-01', subtotal: 60000,  taxTotal: 10800, discountTotal: 0,     total: 70800,  amountPaid: 70800,  currency: 'INR' },
  { id: 'inv19', number: 'INV-2026-000019', subscriptionId: 's25', customerId: 'c24', state: 'PAID',           issueDate: '2026-05-01', dueDate: '2026-05-16', periodStart: '2026-05-01', periodEnd: '2026-06-01', subtotal: 40000,  taxTotal: 4800,  discountTotal: 0,     total: 44800,  amountPaid: 44800,  currency: 'INR' },
  { id: 'inv20', number: 'INV-2026-000020', subscriptionId: 's26', customerId: 'c25', state: 'PAID',           issueDate: '2026-06-01', dueDate: '2026-06-16', periodStart: '2026-06-01', periodEnd: '2026-07-01', subtotal: 70000,  taxTotal: 12600, discountTotal: 0,     total: 82600,  amountPaid: 82600,  currency: 'INR' },
  { id: 'inv21', number: 'INV-2026-000021', subscriptionId: 's27', customerId: 'c26', state: 'PAID',           issueDate: '2026-06-15', dueDate: '2027-06-15', periodStart: '2026-06-15', periodEnd: '2027-06-15', subtotal: 324000, taxTotal: 58320, discountTotal: 0,     total: 382320, amountPaid: 382320, currency: 'INR' },
  { id: 'inv22', number: 'INV-2026-000022', subscriptionId: 's28', customerId: 'c27', state: 'PAID',           issueDate: '2026-07-01', dueDate: '2026-07-16', periodStart: '2026-07-01', periodEnd: '2026-08-01', subtotal: 80000,  taxTotal: 14400, discountTotal: 0,     total: 94400,  amountPaid: 94400,  currency: 'INR' },
  { id: 'inv23', number: 'INV-2026-000023', subscriptionId: 's29', customerId: 'c29', state: 'PAID',           issueDate: '2026-08-01', dueDate: '2026-08-16', periodStart: '2026-08-01', periodEnd: '2026-09-01', subtotal: 45000,  taxTotal: 8100,  discountTotal: 0,     total: 53100,  amountPaid: 53100,  currency: 'INR' },
  { id: 'inv24', number: 'INV-2026-000024', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2026-07-10', dueDate: '2026-07-25', periodStart: '2026-07-10', periodEnd: '2026-08-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv25', number: 'INV-2026-000025', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2026-08-10', dueDate: '2026-08-25', periodStart: '2026-08-10', periodEnd: '2026-09-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv26', number: 'INV-2026-000026', subscriptionId: 's1',  customerId: 'c1',  state: 'PAID',           issueDate: '2026-09-10', dueDate: '2026-09-25', periodStart: '2026-09-10', periodEnd: '2026-10-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 236000, currency: 'INR' },
  { id: 'inv27', number: 'INV-2026-000027', subscriptionId: 's1',  customerId: 'c1',  state: 'CONFIRMED',      issueDate: '2026-10-10', dueDate: '2026-10-25', periodStart: '2026-10-10', periodEnd: '2026-11-10', subtotal: 200000, taxTotal: 36000, discountTotal: 0,     total: 236000, amountPaid: 0,      currency: 'INR' },
  { id: 'inv28', number: 'INV-2026-000028', subscriptionId: 's4',  customerId: 'c3',  state: 'CONFIRMED',      issueDate: '2026-10-01', dueDate: '2026-10-16', periodStart: '2026-10-01', periodEnd: '2026-11-01', subtotal: 80000,  taxTotal: 14400, discountTotal: 0,     total: 94400,  amountPaid: 0,      currency: 'INR' },
  { id: 'inv29', number: 'INV-2026-000029', subscriptionId: 's20', customerId: 'c18', state: 'OVERDUE',        issueDate: '2026-09-01', dueDate: '2026-09-16', periodStart: '2026-09-01', periodEnd: '2026-10-01', subtotal: 55000,  taxTotal: 9900,  discountTotal: 0,     total: 64900,  amountPaid: 20000,  currency: 'INR' },
  { id: 'inv30', number: 'INV-2026-000030', subscriptionId: 's30', customerId: 'c30', state: 'DRAFT',          issueDate: '2026-10-31', dueDate: '2026-11-15', periodStart: '2026-10-31', periodEnd: '2026-11-01', subtotal: 7500,   taxTotal: 1350,  discountTotal: 0,     total: 8850,   amountPaid: 0,      currency: 'INR' },
]

// ---- Payments ----
export interface Payment {
  id: string; number: string; invoiceId: string; customerId: string;
  method: PaymentMethod; amount: number; paidAt: string; reference: string;
}
export const PAYMENTS: Payment[] = [
  { id: 'pay1',  number: 'PAY-2025-000001', invoiceId: 'inv1',  customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2025-02-12', reference: 'UPI/2502/001' },
  { id: 'pay2',  number: 'PAY-2025-000002', invoiceId: 'inv2',  customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2025-03-12', reference: 'UPI/2503/002' },
  { id: 'pay3',  number: 'PAY-2025-000003', invoiceId: 'inv3',  customerId: 'c1',  method: 'BANK_TRANSFER', amount: 236000,  paidAt: '2025-04-12', reference: 'NEFT/2504/001' },
  { id: 'pay4',  number: 'PAY-2025-000004', invoiceId: 'inv4',  customerId: 'c2',  method: 'BANK_TRANSFER', amount: 2048800, paidAt: '2025-03-03', reference: 'RTGS/2503/001' },
  { id: 'pay5',  number: 'PAY-2025-000005', invoiceId: 'inv5',  customerId: 'c3',  method: 'UPI',           amount: 94400,   paidAt: '2025-04-03', reference: 'UPI/2504/003' },
  { id: 'pay6',  number: 'PAY-2025-000006', invoiceId: 'inv6',  customerId: 'c3',  method: 'CARD',          amount: 94400,   paidAt: '2025-05-03', reference: 'CARD/2505/001' },
  { id: 'pay7',  number: 'PAY-2025-000007', invoiceId: 'inv7',  customerId: 'c4',  method: 'UPI',           amount: 82600,   paidAt: '2025-05-17', reference: 'UPI/2505/004' },
  { id: 'pay8',  number: 'PAY-2025-000008', invoiceId: 'inv8',  customerId: 'c6',  method: 'BANK_TRANSFER', amount: 64900,   paidAt: '2025-07-03', reference: 'NEFT/2507/001' },
  { id: 'pay9',  number: 'PAY-2025-000009', invoiceId: 'inv9',  customerId: 'c7',  method: 'UPI',           amount: 53100,   paidAt: '2025-08-03', reference: 'UPI/2508/001' },
  { id: 'pay10', number: 'PAY-2025-000010', invoiceId: 'inv10', customerId: 'c8',  method: 'BANK_TRANSFER', amount: 1019520, paidAt: '2025-09-04', reference: 'RTGS/2509/001' },
  { id: 'pay11', number: 'PAY-2025-000011', invoiceId: 'inv11', customerId: 'c9',  method: 'UPI',           amount: 41300,   paidAt: '2025-10-03', reference: 'UPI/2510/001' },
  { id: 'pay12', number: 'PAY-2025-000012', invoiceId: 'inv14', customerId: 'c12', method: 'CARD',          amount: 40000,   paidAt: '2025-11-18', reference: 'CARD/2511/001' },
  { id: 'pay13', number: 'PAY-2025-000013', invoiceId: 'inv15', customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2025-12-12', reference: 'UPI/2512/001' },
  { id: 'pay14', number: 'PAY-2026-000014', invoiceId: 'inv16', customerId: 'c16', method: 'BANK_TRANSFER', amount: 236000,  paidAt: '2026-01-04', reference: 'NEFT/2601/001' },
  { id: 'pay15', number: 'PAY-2026-000015', invoiceId: 'inv17', customerId: 'c17', method: 'BANK_TRANSFER', amount: 892080,  paidAt: '2026-02-03', reference: 'RTGS/2602/001' },
  { id: 'pay16', number: 'PAY-2026-000016', invoiceId: 'inv18', customerId: 'c23', method: 'UPI',           amount: 70800,   paidAt: '2026-04-03', reference: 'UPI/2604/001' },
  { id: 'pay17', number: 'PAY-2026-000017', invoiceId: 'inv19', customerId: 'c24', method: 'UPI',           amount: 44800,   paidAt: '2026-05-03', reference: 'UPI/2605/001' },
  { id: 'pay18', number: 'PAY-2026-000018', invoiceId: 'inv20', customerId: 'c25', method: 'CARD',          amount: 82600,   paidAt: '2026-06-03', reference: 'CARD/2606/001' },
  { id: 'pay19', number: 'PAY-2026-000019', invoiceId: 'inv21', customerId: 'c26', method: 'BANK_TRANSFER', amount: 382320,  paidAt: '2026-06-17', reference: 'RTGS/2606/002' },
  { id: 'pay20', number: 'PAY-2026-000020', invoiceId: 'inv22', customerId: 'c27', method: 'UPI',           amount: 94400,   paidAt: '2026-07-03', reference: 'UPI/2607/001' },
  { id: 'pay21', number: 'PAY-2026-000021', invoiceId: 'inv23', customerId: 'c29', method: 'BANK_TRANSFER', amount: 53100,   paidAt: '2026-08-03', reference: 'NEFT/2608/001' },
  { id: 'pay22', number: 'PAY-2026-000022', invoiceId: 'inv24', customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2026-07-12', reference: 'UPI/2607/002' },
  { id: 'pay23', number: 'PAY-2026-000023', invoiceId: 'inv25', customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2026-08-12', reference: 'UPI/2608/002' },
  { id: 'pay24', number: 'PAY-2026-000024', invoiceId: 'inv26', customerId: 'c1',  method: 'UPI',           amount: 236000,  paidAt: '2026-09-12', reference: 'UPI/2609/001' },
  { id: 'pay25', number: 'PAY-2026-000025', invoiceId: 'inv29', customerId: 'c18', method: 'CASH',          amount: 20000,   paidAt: '2026-09-10', reference: 'CASH/2609/001' },
]

// ---- Derived KPI helpers ----
export function formatPaise(paise: number): string {
  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rupees)
}

export function calcMRR(): number {
  return SUBSCRIPTIONS.filter(s => s.state === 'ACTIVE').reduce((sum, s) => sum + s.mrr, 0)
}

export function calcARR(): number {
  return calcMRR() * 12
}

export function countActiveSubs(): number {
  return SUBSCRIPTIONS.filter(s => s.state === 'ACTIVE').length
}

export function calcOutstanding(): number {
  return INVOICES.filter(i => i.state === 'CONFIRMED' || i.state === 'PARTIALLY_PAID' || i.state === 'OVERDUE')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0)
}

export function countOverdue(): number {
  return INVOICES.filter(i => i.state === 'OVERDUE').length
}

export function getRevenueByMonth(): { month: string; recognized: number; collected: number }[] {
  const months = ['Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26','Aug 26','Sep 26','Oct 26']
  return [
    { month: 'Nov 25', recognized: 812000,  collected: 770000 },
    { month: 'Dec 25', recognized: 860000,  collected: 860000 },
    { month: 'Jan 26', recognized: 948000,  collected: 920000 },
    { month: 'Feb 26', recognized: 1280000, collected: 1280000 },
    { month: 'Mar 26', recognized: 1120000, collected: 1050000 },
    { month: 'Apr 26', recognized: 1380000, collected: 1380000 },
    { month: 'May 26', recognized: 1450000, collected: 1390000 },
    { month: 'Jun 26', recognized: 1620000, collected: 1580000 },
    { month: 'Jul 26', recognized: 1720000, collected: 1680000 },
    { month: 'Aug 26', recognized: 1890000, collected: 1840000 },
    { month: 'Sep 26', recognized: 1950000, collected: 1870000 },
    { month: 'Oct 26', recognized: 2100000, collected: 1950000 },
  ].map((d, i) => ({ ...d, month: months[i] }))
}

