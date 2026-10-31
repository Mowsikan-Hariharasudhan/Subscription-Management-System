import bcrypt from 'bcryptjs';
import { addDays, addMonths, subDays, subMonths, addYears } from 'date-fns';
import { prisma } from '../src/config/prisma';

async function main() {
  console.log('Seeding Brightloop database with comprehensive demo dataset...');

  // Clear existing records in correct relation order
  await prisma.payment.deleteMany();
  await prisma.discountRedemption.deleteMany();
  await prisma.discountProduct.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscriptionLine.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.quotationLine.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.quotationTemplateLine.deleteMany();
  await prisma.quotationTemplate.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.taxRule.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing records.');

  // 1. Users
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const staffPassword = await bcrypt.hash('Staff@1234', 10);
  const customerPassword = await bcrypt.hash('Customer@1234', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@brightloop.io',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const staffSarah = await prisma.user.create({
    data: {
      email: 'sarah@brightloop.io',
      password: staffPassword,
      role: 'STAFF',
      isActive: true,
    },
  });

  const staffMike = await prisma.user.create({
    data: {
      email: 'mike@brightloop.io',
      password: staffPassword,
      role: 'STAFF',
      isActive: true,
    },
  });

  console.log('Created Admin and Staff accounts.');

  // 10 Customers
  const customerData = [
    { name: 'Acme Corporation', company: 'Acme Corp Ltd', phone: '+91 98765 43210', address: '12 Tech Park, Whitefield, Bengaluru' },
    { name: 'Globex Health', company: 'Globex Health Systems', phone: '+91 98765 43211', address: '44 Healthcare Ave, BKC, Mumbai' },
    { name: 'Soylent Foods', company: 'Soylent Agro Industries', phone: '+91 98765 43212', address: '78 Greenfield Rd, Pune' },
    { name: 'Initech Software', company: 'Initech Technologies', phone: '+91 98765 43213', address: '10 Cyber City, Gurugram' },
    { name: 'Umbrella Retail', company: 'Umbrella Retail Chains', phone: '+91 98765 43214', address: '55 Commerce St, Chennai' },
    { name: 'Hooli Media', company: 'Hooli Entertainment', phone: '+91 98765 43215', address: '88 Film Nagar, Hyderabad' },
    { name: 'Massive Dynamic', company: 'Massive Dynamics Lab', phone: '+91 98765 43216', address: '9 Science City Road, Ahmedabad' },
    { name: 'Stark Logistics', company: 'Stark Freight & Cargo', phone: '+91 98765 43217', address: '22 Port Trust Rd, Kochi' },
    { name: 'Wayne Financial', company: 'Wayne Capital Services', phone: '+91 98765 43218', address: '14 Dalal Street, Mumbai' },
    { name: 'Cyberdyne AI', company: 'Cyberdyne Systems India', phone: '+91 98765 43219', address: '3 Electronic City, Bengaluru' },
  ];

  const customers: any[] = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i + 1}@example.com`,
        password: customerPassword,
        role: 'CUSTOMER',
        isActive: true,
      },
    });

    const cust = await prisma.customer.create({
      data: {
        userId: user.id,
        name: customerData[i].name,
        companyName: customerData[i].company,
        phone: customerData[i].phone,
        billingAddress: customerData[i].address,
        isActive: true,
      },
    });
    customers.push(cust);
  }

  console.log(`Created 10 customer accounts.`);

  // 2. Tax Rules
  const gst18 = await prisma.taxRule.create({
    data: {
      name: 'GST 18%',
      rate: 1800, // 18.00%
      description: 'Standard Goods & Services Tax for IT / SaaS',
      isActive: true,
    },
  });

  const gst5 = await prisma.taxRule.create({
    data: {
      name: 'GST 5%',
      rate: 500, // 5.00%
      description: 'Concessional GST rate',
      isActive: true,
    },
  });

  console.log('Created Tax Rules (GST 18% & GST 5%).');

  // 3. Products & Variants
  // BrightCRM (SOFTWARE) ₹2,000/month
  const crm = await prisma.product.create({
    data: {
      name: 'BrightCRM',
      type: 'SOFTWARE',
      salesPrice: 200000, // ₹2,000 in paise
      costPrice: 50000,
      notes: 'Customer relationship management platform with sales pipeline and email integration.',
      isActive: true,
    },
  });

  const crmStarter = await prisma.productVariant.create({
    data: {
      productId: crm.id,
      name: 'Starter',
      attributeName: 'Tier',
      additionalPrice: 0,
      isActive: true,
    },
  });

  const crmPro = await prisma.productVariant.create({
    data: {
      productId: crm.id,
      name: 'Professional',
      attributeName: 'Tier',
      additionalPrice: 50000, // +₹500
      isActive: true,
    },
  });

  const crmEnterprise = await prisma.productVariant.create({
    data: {
      productId: crm.id,
      name: 'Enterprise',
      attributeName: 'Tier',
      additionalPrice: 150000, // +₹1,500
      isActive: true,
    },
  });

  // BrightHR (SOFTWARE) ₹1,500/month
  const hr = await prisma.product.create({
    data: {
      name: 'BrightHR',
      type: 'SOFTWARE',
      salesPrice: 150000, // ₹1,500
      costPrice: 40000,
      notes: 'Human resources, attendance tracking, and automated payroll management.',
      isActive: true,
    },
  });

  const hrBasic = await prisma.productVariant.create({
    data: {
      productId: hr.id,
      name: 'Basic',
      attributeName: 'Tier',
      additionalPrice: 0,
      isActive: true,
    },
  });

  const hrAdvanced = await prisma.productVariant.create({
    data: {
      productId: hr.id,
      name: 'Advanced',
      attributeName: 'Tier',
      additionalPrice: 80000, // +₹800
      isActive: true,
    },
  });

  // BrightPOS (SOFTWARE) ₹800/month
  const pos = await prisma.product.create({
    data: {
      name: 'BrightPOS',
      type: 'SOFTWARE',
      salesPrice: 80000, // ₹800
      costPrice: 20000,
      notes: 'Point of sale terminal with offline capabilities and inventory sync.',
      isActive: true,
    },
  });

  // Implementation Support (SERVICE) ₹5,000 one-time
  const implementation = await prisma.product.create({
    data: {
      name: 'Implementation Support',
      type: 'SERVICE',
      salesPrice: 500000, // ₹5,000
      costPrice: 200000,
      notes: 'Dedicated onboarding engineer and legacy data migration.',
      isActive: true,
    },
  });

  // Training Package (SERVICE) ₹3,000
  const training = await prisma.product.create({
    data: {
      name: 'Training Package',
      type: 'SERVICE',
      salesPrice: 300000, // ₹3,000
      costPrice: 100000,
      notes: 'Interactive training sessions for up to 25 team members.',
      isActive: true,
    },
  });

  console.log('Created Products and Variants.');

  // 4. Plans
  const monthlyPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Monthly SaaS Plan',
      description: 'Standard monthly billing with complete flexibility.',
      billingFrequency: 'MONTHLY',
      minimumQuantity: 1,
      autoClose: false,
      allowEarlyClosure: true,
      allowPause: true,
      allowRenewal: true,
      isActive: true,
    },
  });

  const yearlyPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Yearly SaaS Plan',
      description: 'Annual commitment with discounted rates and priority SLA.',
      billingFrequency: 'YEARLY',
      minimumQuantity: 1,
      autoClose: false,
      allowEarlyClosure: true,
      allowPause: false,
      allowRenewal: true,
      isActive: true,
    },
  });

  const weeklyTrialPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Weekly Trial',
      description: '7-day evaluation plan without renewal.',
      billingFrequency: 'WEEKLY',
      minimumQuantity: 1,
      autoClose: true,
      allowEarlyClosure: true,
      allowPause: false,
      allowRenewal: false,
      isActive: true,
    },
  });

  const dailyDevPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Daily Dev Plan',
      description: 'Daily metered environment for testing and development.',
      billingFrequency: 'DAILY',
      minimumQuantity: 1,
      autoClose: false,
      allowEarlyClosure: true,
      allowPause: true,
      allowRenewal: true,
      isActive: true,
    },
  });

  console.log('Created Subscription Plans.');

  // 5. Discount Rules
  const discountNewCustomer = await prisma.discountRule.create({
    data: {
      name: 'New Customer Discount',
      type: 'PERCENTAGE',
      value: 1000, // 10.00%
      minPurchaseAmount: 100000, // ₹1,000 in paise
      minQuantity: 1,
      isActive: true,
    },
  });

  const discountLoyalty = await prisma.discountRule.create({
    data: {
      name: 'Annual Loyalty',
      type: 'FIXED',
      value: 200000, // ₹2,000 fixed
      minPurchaseAmount: 1500000, // ₹15,000 min
      minQuantity: 1,
      isActive: true,
    },
  });

  const discountVolume = await prisma.discountRule.create({
    data: {
      name: 'Volume Discount',
      type: 'PERCENTAGE',
      value: 1500, // 15.00%
      minPurchaseAmount: 0,
      minQuantity: 3,
      isActive: true,
    },
  });

  console.log('Created Discount Rules.');

  // 6. Quotation Templates
  const templateCrmStarter = await prisma.quotationTemplate.create({
    data: {
      name: 'Monthly CRM Starter',
      planId: monthlyPlan.id,
      validityDays: 30,
      paymentTerms: 'Due on Receipt',
      isActive: true,
      lines: {
        create: [
          {
            productId: crm.id,
            taxRuleId: gst18.id,
            quantity: 1,
            unitPrice: crm.salesPrice, // 200000
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const templateHrPackage = await prisma.quotationTemplate.create({
    data: {
      name: 'Annual HR Package',
      planId: yearlyPlan.id,
      validityDays: 30,
      paymentTerms: 'Net 30',
      isActive: true,
      lines: {
        create: [
          {
            productId: hr.id,
            taxRuleId: gst18.id,
            quantity: 1,
            unitPrice: hr.salesPrice + hrAdvanced.additionalPrice, // 230000
            sortOrder: 0,
          },
          {
            productId: training.id,
            taxRuleId: gst18.id,
            quantity: 1,
            unitPrice: training.salesPrice, // 300000
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log('Created Quotation Templates.');

  // 7. Quotations
  // DRAFT quotation
  await prisma.quotation.create({
    data: {
      number: 'QT-202610-0001',
      customerId: customers[0].id,
      planId: monthlyPlan.id,
      templateId: templateCrmStarter.id,
      status: 'DRAFT',
      expiryDate: addDays(new Date(), 30),
      paymentTerms: 'Net 15',
      subtotal: 200000,
      discountAmt: 0,
      taxAmount: 36000,
      total: 236000,
      notes: 'Initial proposal for CRM starter seats.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmStarter.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Starter',
            quantity: 1,
            unitPrice: 200000,
            taxRate: 1800,
            taxAmount: 36000,
            lineTotal: 236000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // SENT quotation
  await prisma.quotation.create({
    data: {
      number: 'QT-202610-0002',
      customerId: customers[1].id,
      planId: yearlyPlan.id,
      templateId: templateHrPackage.id,
      status: 'SENT',
      expiryDate: addDays(new Date(), 20),
      paymentTerms: 'Net 30',
      subtotal: 530000,
      discountAmt: 53000, // 10%
      taxAmount: 85860,
      total: 562860,
      notes: 'Sent to HR Director for annual approval.',
      lines: {
        create: [
          {
            productId: hr.id,
            variantId: hrAdvanced.id,
            taxRuleId: gst18.id,
            description: 'BrightHR Advanced',
            quantity: 1,
            unitPrice: 230000,
            taxRate: 1800,
            taxAmount: 41400,
            lineTotal: 271400,
            sortOrder: 0,
          },
          {
            productId: training.id,
            taxRuleId: gst18.id,
            description: 'Team Training Session',
            quantity: 1,
            unitPrice: 300000,
            taxRate: 1800,
            taxAmount: 54000,
            lineTotal: 354000,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // ACCEPTED quotation
  const acceptedQt = await prisma.quotation.create({
    data: {
      number: 'QT-202610-0003',
      customerId: customers[2].id,
      planId: monthlyPlan.id,
      status: 'ACCEPTED',
      expiryDate: addDays(new Date(), 10),
      paymentTerms: 'Net 15',
      subtotal: 250000,
      discountAmt: 0,
      taxAmount: 45000,
      total: 295000,
      notes: 'Accepted via digital approval.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmPro.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Pro',
            quantity: 1,
            unitPrice: 250000,
            taxRate: 1800,
            taxAmount: 45000,
            lineTotal: 295000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // EXPIRED quotation
  await prisma.quotation.create({
    data: {
      number: 'QT-202609-0004',
      customerId: customers[3].id,
      planId: weeklyTrialPlan.id,
      status: 'EXPIRED',
      expiryDate: subDays(new Date(), 15),
      paymentTerms: 'Due on Receipt',
      subtotal: 80000,
      discountAmt: 0,
      taxAmount: 14400,
      total: 94400,
      notes: 'Trial quotation expired last month.',
      lines: {
        create: [
          {
            productId: pos.id,
            taxRuleId: gst18.id,
            description: 'BrightPOS Terminal',
            quantity: 1,
            unitPrice: 80000,
            taxRate: 1800,
            taxAmount: 14400,
            lineTotal: 94400,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log('Created Quotations (DRAFT, SENT, ACCEPTED, EXPIRED).');

  // 8. Subscriptions
  // Subscription 1: ACTIVE monthly, nextBillingDate = today (ready for billing demo!)
  const sub1 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0001',
      customerId: customers[0].id,
      planId: monthlyPlan.id,
      status: 'ACTIVE',
      startDate: subMonths(new Date(), 2),
      nextBillingDate: new Date(), // TODAY
      paymentTerms: 'Net 15',
      notes: 'Active monthly enterprise subscription ready for billing cycle demo.',
      subtotal: 250000,
      taxAmount: 45000,
      total: 295000,
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmPro.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Professional',
            quantity: 1,
            unitPrice: 250000,
            taxRate: 1800,
            lineTotal: 295000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 2: ACTIVE monthly, nextBillingDate = yesterday (due now)
  const sub2 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0002',
      customerId: customers[1].id,
      planId: monthlyPlan.id,
      status: 'ACTIVE',
      startDate: subMonths(new Date(), 1),
      nextBillingDate: subDays(new Date(), 1), // YESTERDAY
      paymentTerms: 'Net 15',
      notes: 'Active monthly subscription due for invoice generation.',
      subtotal: 150000,
      taxAmount: 27000,
      total: 177000,
      lines: {
        create: [
          {
            productId: hr.id,
            variantId: hrBasic.id,
            taxRuleId: gst18.id,
            description: 'BrightHR Basic',
            quantity: 1,
            unitPrice: 150000,
            taxRate: 1800,
            lineTotal: 177000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 3: ACTIVE monthly, nextBillingDate = today
  const sub3 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0003',
      customerId: customers[2].id,
      planId: monthlyPlan.id,
      status: 'ACTIVE',
      startDate: subMonths(new Date(), 3),
      nextBillingDate: new Date(),
      paymentTerms: 'Net 30',
      notes: 'High volume POS deployment.',
      subtotal: 240000,
      taxAmount: 43200,
      total: 283200,
      lines: {
        create: [
          {
            productId: pos.id,
            taxRuleId: gst18.id,
            description: 'BrightPOS (3 Terminals)',
            quantity: 3,
            unitPrice: 80000,
            taxRate: 1800,
            lineTotal: 283200,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 4: ACTIVE Yearly
  const sub4 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0004',
      customerId: customers[3].id,
      planId: yearlyPlan.id,
      status: 'ACTIVE',
      startDate: subMonths(new Date(), 6),
      expiryDate: addMonths(new Date(), 6),
      nextBillingDate: addMonths(new Date(), 6),
      paymentTerms: 'Net 30',
      notes: 'Enterprise Yearly Agreement.',
      subtotal: 3500000,
      taxAmount: 630000,
      total: 4130000,
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmEnterprise.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Enterprise Annual',
            quantity: 1,
            unitPrice: 3500000,
            taxRate: 1800,
            lineTotal: 4130000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 5: PAUSED subscription
  const sub5 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0005',
      customerId: customers[4].id,
      planId: monthlyPlan.id,
      status: 'PAUSED',
      startDate: subMonths(new Date(), 4),
      nextBillingDate: addMonths(new Date(), 1),
      paymentTerms: 'Net 15',
      notes: 'Paused by customer during business remodel.',
      subtotal: 200000,
      taxAmount: 36000,
      total: 236000,
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmStarter.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Starter',
            quantity: 1,
            unitPrice: 200000,
            taxRate: 1800,
            lineTotal: 236000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 6: CLOSED subscription
  const sub6 = await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0006',
      customerId: customers[5].id,
      planId: weeklyTrialPlan.id,
      status: 'CLOSED',
      startDate: subMonths(new Date(), 2),
      expiryDate: subMonths(new Date(), 1),
      nextBillingDate: null,
      paymentTerms: 'Due on Receipt',
      notes: 'Trial closed upon completion.',
      subtotal: 80000,
      taxAmount: 14400,
      total: 94400,
      lines: {
        create: [
          {
            productId: pos.id,
            taxRuleId: gst18.id,
            description: 'Trial Terminal',
            quantity: 1,
            unitPrice: 80000,
            taxRate: 1800,
            lineTotal: 94400,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Subscription 7: DRAFT subscription
  await prisma.subscription.create({
    data: {
      number: 'SUB-202610-0007',
      customerId: customers[6].id,
      planId: dailyDevPlan.id,
      status: 'DRAFT',
      startDate: new Date(),
      nextBillingDate: addDays(new Date(), 1),
      paymentTerms: 'Due on Receipt',
      notes: 'Draft setup awaiting approval.',
      subtotal: 50000,
      taxAmount: 9000,
      total: 59000,
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmStarter.id,
            taxRuleId: gst18.id,
            description: 'Daily Dev Seat',
            quantity: 1,
            unitPrice: 50000,
            taxRate: 1800,
            lineTotal: 59000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log('Created Subscriptions (3 ACTIVE due for billing, 1 YEARLY, 1 PAUSED, 1 CLOSED, 1 DRAFT).');

  // 9. Invoices
  // Invoice 1: CONFIRMED unpaid (Current)
  const inv1 = await prisma.invoice.create({
    data: {
      number: 'INV-202610-0001',
      customerId: customers[0].id,
      subscriptionId: sub1.id,
      status: 'CONFIRMED',
      periodStart: subMonths(new Date(), 1),
      periodEnd: subDays(new Date(), 1),
      issueDate: subDays(new Date(), 5),
      dueDate: addDays(new Date(), 10), // Not overdue
      subtotal: 250000,
      discountAmt: 0,
      taxAmount: 45000,
      total: 295000,
      amountPaid: 0,
      outstanding: 295000,
      notes: 'Standard monthly invoice.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmPro.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Professional',
            quantity: 1,
            unitPrice: 200000,
            variantPrice: 50000,
            taxRate: 1800,
            taxAmount: 45000,
            lineTotal: 295000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Invoice 2: PAID invoice
  const inv2 = await prisma.invoice.create({
    data: {
      number: 'INV-202609-0002',
      customerId: customers[0].id,
      subscriptionId: sub1.id,
      status: 'PAID',
      periodStart: subMonths(new Date(), 2),
      periodEnd: subMonths(new Date(), 1),
      issueDate: subMonths(new Date(), 2),
      dueDate: subDays(subMonths(new Date(), 1), 15),
      subtotal: 250000,
      discountAmt: 25000,
      taxAmount: 40500,
      total: 265500,
      amountPaid: 265500,
      outstanding: 0,
      notes: 'Paid in full on time.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmPro.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Professional',
            quantity: 1,
            unitPrice: 200000,
            variantPrice: 50000,
            taxRate: 1800,
            taxAmount: 40500,
            lineTotal: 265500,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Invoice 3: OVERDUE 1 (dueDate in the past, status CONFIRMED, outstanding > 0)
  const invOverdue1 = await prisma.invoice.create({
    data: {
      number: 'INV-202608-0003',
      customerId: customers[1].id,
      subscriptionId: sub2.id,
      status: 'CONFIRMED',
      periodStart: subMonths(new Date(), 2),
      periodEnd: subMonths(new Date(), 1),
      issueDate: subMonths(new Date(), 2),
      dueDate: subDays(new Date(), 10), // 10 days OVERDUE
      subtotal: 150000,
      discountAmt: 0,
      taxAmount: 27000,
      total: 177000,
      amountPaid: 0,
      outstanding: 177000,
      notes: 'Payment reminder sent.',
      lines: {
        create: [
          {
            productId: hr.id,
            variantId: hrBasic.id,
            taxRuleId: gst18.id,
            description: 'BrightHR Basic',
            quantity: 1,
            unitPrice: 150000,
            variantPrice: 0,
            taxRate: 1800,
            taxAmount: 27000,
            lineTotal: 177000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Invoice 4: OVERDUE 2 with Partial Payment
  const invOverdue2 = await prisma.invoice.create({
    data: {
      number: 'INV-202608-0004',
      customerId: customers[2].id,
      subscriptionId: sub3.id,
      status: 'CONFIRMED',
      periodStart: subMonths(new Date(), 2),
      periodEnd: subMonths(new Date(), 1),
      issueDate: subMonths(new Date(), 2),
      dueDate: subDays(new Date(), 5), // 5 days OVERDUE
      subtotal: 240000,
      discountAmt: 0,
      taxAmount: 43200,
      total: 283200,
      amountPaid: 100000, // ₹1,000 partial payment
      outstanding: 183200,
      notes: 'Partial payment received, remaining balance overdue.',
      lines: {
        create: [
          {
            productId: pos.id,
            taxRuleId: gst18.id,
            description: 'BrightPOS (3 units)',
            quantity: 3,
            unitPrice: 80000,
            variantPrice: 0,
            taxRate: 1800,
            taxAmount: 43200,
            lineTotal: 283200,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Invoice 5: Another PAID invoice (Yearly)
  const inv5 = await prisma.invoice.create({
    data: {
      number: 'INV-202604-0005',
      customerId: customers[3].id,
      subscriptionId: sub4.id,
      status: 'PAID',
      periodStart: subMonths(new Date(), 6),
      periodEnd: addMonths(new Date(), 6),
      issueDate: subMonths(new Date(), 6),
      dueDate: subMonths(new Date(), 5),
      subtotal: 3500000,
      discountAmt: 200000, // Loyalty discount
      taxAmount: 594000,
      total: 3894000,
      amountPaid: 3894000,
      outstanding: 0,
      notes: 'Annual upfront payment received via Bank Wire.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmEnterprise.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Enterprise Annual',
            quantity: 1,
            unitPrice: 2000000,
            variantPrice: 1500000,
            taxRate: 1800,
            taxAmount: 594000,
            lineTotal: 3894000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Invoice 6: CANCELLED invoice
  await prisma.invoice.create({
    data: {
      number: 'INV-202608-0006',
      customerId: customers[4].id,
      subscriptionId: sub5.id,
      status: 'CANCELLED',
      periodStart: subMonths(new Date(), 3),
      periodEnd: subMonths(new Date(), 2),
      issueDate: subMonths(new Date(), 3),
      dueDate: subMonths(new Date(), 2),
      subtotal: 200000,
      discountAmt: 0,
      taxAmount: 36000,
      total: 236000,
      amountPaid: 0,
      outstanding: 236000,
      notes: 'Cancelled due to billing pause arrangement.',
      lines: {
        create: [
          {
            productId: crm.id,
            variantId: crmStarter.id,
            taxRuleId: gst18.id,
            description: 'BrightCRM Starter',
            quantity: 1,
            unitPrice: 200000,
            variantPrice: 0,
            taxRate: 1800,
            taxAmount: 36000,
            lineTotal: 236000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log('Created Invoices (CONFIRMED, PAID, OVERDUE, CANCELLED).');

  // 10. Payments
  // Payment for inv2 (fully paid)
  await prisma.payment.create({
    data: {
      invoiceId: inv2.id,
      createdById: staffSarah.id,
      method: 'BANK_TRANSFER',
      amount: 265500, // ₹2,655.00
      paymentDate: subDays(subMonths(new Date(), 1), 18),
      notes: 'NEFT transfer Ref #987219827391',
    },
  });

  // Payment for invOverdue2 (partial payment)
  await prisma.payment.create({
    data: {
      invoiceId: invOverdue2.id,
      createdById: staffMike.id,
      method: 'UPI',
      amount: 100000, // ₹1,000.00
      paymentDate: subDays(new Date(), 3),
      notes: 'UPI payment received via GPay',
    },
  });

  // Payment for inv5 (annual paid)
  await prisma.payment.create({
    data: {
      invoiceId: inv5.id,
      createdById: admin.id,
      method: 'BANK_TRANSFER',
      amount: 3894000, // ₹38,940.00
      paymentDate: subDays(subMonths(new Date(), 5), 20),
      notes: 'RTGS transfer from Wayne Capital Treasury',
    },
  });

  console.log('Created Payments (Full payments & Partial payment).');

  console.log('\n======================================================');
  console.log(' Brightloop Demo Database Seeded Successfully!');
  console.log(' Credentials:');
  console.log('   Admin: admin@brightloop.io / Admin@1234');
  console.log('   Staff: sarah@brightloop.io / Staff@1234');
  console.log('   Staff: mike@brightloop.io / Staff@1234');
  console.log('   Customer: customer1@example.com / Customer@1234');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

