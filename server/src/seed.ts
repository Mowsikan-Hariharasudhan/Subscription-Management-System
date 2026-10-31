import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

async function seed() {
  console.log('🌱 Starting Brightloop database seed...');

  // Clear existing data in reverse order of foreign keys
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.taxRule.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.settings.deleteMany();

  // 1. Settings
  await prisma.settings.create({
    data: {
      id: 1,
      companyName: 'Brightloop Software Systems Pvt Ltd',
      gstin: '33AAACB9876Z1Z8',
      currency: 'INR',
      billingCron: '0 0 * * *',
    },
  });

  // 2. Customers
  const zoho = await prisma.customer.create({
    data: {
      code: 'CUS-001',
      name: 'Sridhar Vembu',
      company: 'Zoho Corporation',
      email: 'finance@zoho.com',
      phone: '+91 98401 23456',
      gstin: '33AABCZ1234F1Z5',
      address: 'Estancia IT Park, Vallancheri, GST Road',
      city: 'Chennai',
      status: 'ACTIVE',
    },
  });

  const freshworks = await prisma.customer.create({
    data: {
      code: 'CUS-002',
      name: 'Girish Mathrubootham',
      company: 'Freshworks Technologies',
      email: 'billing@freshworks.com',
      phone: '+91 98840 54321',
      gstin: '33AAACF5678B1Z2',
      address: 'SP Infocity, MGR Salai, Perungudi',
      city: 'Chennai',
      status: 'ACTIVE',
    },
  });

  const razorpay = await prisma.customer.create({
    data: {
      code: 'CUS-003',
      name: 'Harshil Mathur',
      company: 'Razorpay Software',
      email: 'ops@razorpay.com',
      phone: '+91 99160 88776',
      gstin: '29AABCR9988C1Z9',
      address: 'SJRS Towers, Koramangala 3rd Block',
      city: 'Bengaluru',
      status: 'ACTIVE',
    },
  });

  // 3. Users with hashed passwords
  const adminHash = await bcrypt.hash('Admin#2026', 10);
  const staffHash = await bcrypt.hash('Staff#2026', 10);
  const custHash = await bcrypt.hash('Cust#2026', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@brightloop.dev',
        passwordHash: adminHash,
        name: 'Arun Kumar (System Admin)',
        role: 'ADMIN',
        isActive: true,
      },
      {
        email: 'staff@brightloop.dev',
        passwordHash: staffHash,
        name: 'Priya Sharma (Operations)',
        role: 'STAFF',
        isActive: true,
      },
      {
        email: 'customer@brightloop.dev',
        passwordHash: custHash,
        name: 'Sridhar Vembu (Zoho Corp)',
        role: 'CUSTOMER',
        customerId: zoho.id,
        isActive: true,
      },
    ],
  });

  // 4. Products & Variants
  const erpProduct = await prisma.product.create({
    data: {
      code: 'PRD-001',
      name: 'Brightloop ERP Core Engine',
      type: 'Software',
      salesPrice: 200000, // ₹2,000.00
      costPrice: 50000,   // ₹500.00
      description: 'Enterprise resource and subscription billing automation engine.',
      status: 'ACTIVE',
      variants: {
        create: [
          {
            name: 'Odoo Enterprise Sync Module',
            priceDelta: 56000, // +₹560.00
            isActive: true,
          },
          {
            name: 'Multi-Entity Consolidated Ledger',
            priceDelta: 80000, // +₹800.00
            isActive: true,
          },
        ],
      },
    },
  });

  const billingProduct = await prisma.product.create({
    data: {
      code: 'PRD-002',
      name: 'Automated Invoicing & E-Waybill Suite',
      type: 'Software',
      salesPrice: 150000, // ₹1,500.00
      costPrice: 30000,
      description: 'Real-time GST-compliant recurring invoice dispatch with auto-reconciliation.',
      status: 'ACTIVE',
      variants: {
        create: [
          {
            name: 'High-Concurrency Processing (10k ops/sec)',
            priceDelta: 45000, // +₹450.00
            isActive: true,
          },
        ],
      },
    },
  });

  // 5. Plans
  const monthlyPlan = await prisma.plan.create({
    data: {
      code: 'PLN-001',
      productId: erpProduct.id,
      name: 'ERP Core Monthly Standard',
      price: 200000, // ₹2,000.00 / month
      billingCycle: 'MONTHLY',
      minQty: 1,
      allowPause: true,
      allowRenew: true,
      allowEarlyClose: true,
      autoClose: false,
      isActive: true,
    },
  });

  const yearlyPlan = await prisma.plan.create({
    data: {
      code: 'PLN-002',
      productId: erpProduct.id,
      name: 'ERP Core Enterprise Annual',
      price: 2000000, // ₹20,000.00 / year
      billingCycle: 'YEARLY',
      minQty: 1,
      allowPause: false,
      allowRenew: true,
      allowEarlyClose: false,
      autoClose: false,
      isActive: true,
    },
  });

  const suitePlan = await prisma.plan.create({
    data: {
      code: 'PLN-003',
      productId: billingProduct.id,
      name: 'Invoicing Suite Monthly Pro',
      price: 150000, // ₹1,500.00 / month
      billingCycle: 'MONTHLY',
      minQty: 1,
      allowPause: true,
      allowRenew: true,
      allowEarlyClose: true,
      autoClose: false,
      isActive: true,
    },
  });

  // 6. Tax Rules
  await prisma.taxRule.createMany({
    data: [
      {
        name: 'GST 18% (Standard Software B2B)',
        rate: 18.0,
        type: 'IGST',
        effectiveFrom: new Date('2024-01-01'),
        effectiveTo: new Date('2030-12-31'),
        isActive: true,
      },
      {
        name: 'GST 12% (Concessional IT Services)',
        rate: 12.0,
        type: 'IGST',
        effectiveFrom: new Date('2024-01-01'),
        effectiveTo: new Date('2030-12-31'),
        isActive: true,
      },
    ],
  });

  // 7. Discounts
  await prisma.discount.createMany({
    data: [
      {
        name: 'FOUNDER20 (20% Off)',
        type: 'PERCENT',
        value: 20,
        minQty: 1,
        minPurchase: 100000, // ₹1,000 min
        maxUses: 50,
        usedCount: 2,
        scope: 'SUBSCRIPTION',
        startsAt: new Date('2025-01-01'),
        endsAt: new Date('2027-12-31'),
        isActive: true,
      },
      {
        name: 'FLAT500 (₹500 Instant Discount)',
        type: 'FIXED',
        value: 50000, // ₹500.00
        minQty: 1,
        minPurchase: 150000, // ₹1,500 min
        maxUses: 100,
        usedCount: 5,
        scope: 'SUBSCRIPTION',
        startsAt: new Date('2025-01-01'),
        endsAt: new Date('2027-12-31'),
        isActive: true,
      },
    ],
  });

  // 8. Quotations
  await prisma.quotation.create({
    data: {
      number: 'QTN-2026-0001',
      customerId: zoho.id,
      state: 'CONFIRMED',
      total: 200000,
      validUntil: new Date('2026-12-31'),
      lines: JSON.stringify([
        {
          productId: erpProduct.id,
          productName: erpProduct.name,
          quantity: 1,
          unitPrice: 200000,
          total: 200000,
        },
      ]),
    },
  });

  // 9. Subscriptions
  const sub1 = await prisma.subscription.create({
    data: {
      code: 'SUB-2026-000001',
      customerId: zoho.id,
      planId: monthlyPlan.id,
      state: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      nextBillingDate: new Date('2026-04-01'),
      total: 200000, // ₹2,000
      mrr: 200000,   // ₹2,000
      lines: JSON.stringify([{ productId: erpProduct.id, name: erpProduct.name, qty: 1 }]),
    },
  });

  const sub2 = await prisma.subscription.create({
    data: {
      code: 'SUB-2026-000002',
      customerId: freshworks.id,
      planId: yearlyPlan.id,
      state: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      nextBillingDate: new Date('2027-01-01'),
      total: 2000000, // ₹20,000 / yr
      mrr: 166667,    // ₹1,666.67 / mo normalized
      lines: JSON.stringify([{ productId: erpProduct.id, name: erpProduct.name, qty: 1 }]),
    },
  });

  const sub3 = await prisma.subscription.create({
    data: {
      code: 'SUB-2026-000003',
      customerId: razorpay.id,
      planId: suitePlan.id,
      state: 'ACTIVE',
      startDate: new Date('2026-02-01'),
      expiryDate: new Date('2027-02-01'),
      nextBillingDate: new Date('2026-04-01'),
      total: 150000,
      mrr: 150000,
      lines: JSON.stringify([{ productId: billingProduct.id, name: billingProduct.name, qty: 1 }]),
    },
  });

  // 10. Invoices
  // Invoice 1: Paid invoice
  const inv1 = await prisma.invoice.create({
    data: {
      code: 'INV-2026-000001',
      subscriptionId: sub1.id,
      customerId: zoho.id,
      state: 'PAID',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      issueDate: new Date('2026-01-01'),
      dueDate: new Date('2026-01-15'),
      subtotal: 200000,
      taxTotal: 36000, // 18% IGST
      discountTotal: 0,
      total: 236000,
      amountPaid: 236000,
      lines: JSON.stringify([
        {
          description: 'ERP Core Monthly Standard (Jan 2026)',
          amount: 200000,
          tax: 36000,
        },
      ]),
    },
  });

  // Invoice 2: Overdue invoice
  await prisma.invoice.create({
    data: {
      code: 'INV-2026-000002',
      subscriptionId: sub2.id,
      customerId: freshworks.id,
      state: 'OVERDUE',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2027-01-01'),
      issueDate: new Date('2026-01-01'),
      dueDate: new Date('2026-01-15'), // Past due
      subtotal: 2000000,
      taxTotal: 360000,
      discountTotal: 0,
      total: 2360000,
      amountPaid: 0,
      lines: JSON.stringify([
        {
          description: 'ERP Core Enterprise Annual (2026-2027)',
          amount: 2000000,
          tax: 360000,
        },
      ]),
    },
  });

  // Invoice 3: Partially paid invoice
  await prisma.invoice.create({
    data: {
      code: 'INV-2026-000003',
      subscriptionId: sub3.id,
      customerId: razorpay.id,
      state: 'PARTIALLY_PAID',
      periodStart: new Date('2026-02-01'),
      periodEnd: new Date('2026-03-01'),
      issueDate: new Date('2026-02-01'),
      dueDate: new Date('2026-04-15'),
      subtotal: 150000,
      taxTotal: 27000,
      discountTotal: 0,
      total: 177000,
      amountPaid: 77000,
      lines: JSON.stringify([
        {
          description: 'Invoicing Suite Monthly Pro (Feb 2026)',
          amount: 150000,
          tax: 27000,
        },
      ]),
    },
  });

  // 11. Payments
  await prisma.payment.create({
    data: {
      number: 'PAY-2026-000001',
      invoiceId: inv1.id,
      amount: 236000,
      method: 'UPI',
      reference: 'UPI/20260105/ZOHO-99120',
      paidAt: new Date('2026-01-05'),
      notes: 'Cleared via HDFC Current Account settlement',
    },
  });

  // 12. Audit Log
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'SEED_INITIALIZATION',
        entity: 'SYSTEM',
        entityId: '0',
        changes: JSON.stringify({ message: 'Clean seed data inserted with standard credentials.' }),
      },
      {
        action: 'INVOICE_GENERATED',
        entity: 'Invoice',
        entityId: inv1.id,
        changes: JSON.stringify({ code: 'INV-2026-000001', total: 236000 }),
      },
    ],
  });

  console.log('✅ Brightloop database seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Default Credentials:');
  console.log('• Admin:    admin@brightloop.dev    / Admin#2026');
  console.log('• Staff:    staff@brightloop.dev    / Staff#2026');
  console.log('• Customer: customer@brightloop.dev / Cust#2026');
  console.log('----------------------------------------------------');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

