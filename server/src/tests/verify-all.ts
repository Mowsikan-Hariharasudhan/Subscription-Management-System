import { createApp } from '../app';
import { prisma, initDbPragmas } from '../config/prisma';
import http from 'http';

interface TestContext {
  baseUrl: string;
  server: http.Server;
  adminToken: string;
  staffToken: string;
  customerToken: string;
}

let ctx: TestContext;

const toJson = async (res: Response): Promise<any> => res.json();

async function setup() {
  await initDbPragmas();
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  // Login as admin
  const adminRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@brightloop.io', password: 'Admin@1234' }),
  });
  const adminJson = await toJson(adminRes);

  // Login as staff
  const staffRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah@brightloop.io', password: 'Staff@1234' }),
  });
  const staffJson = await toJson(staffRes);

  // Login as customer
  const custRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer1@example.com', password: 'Customer@1234' }),
  });
  const custJson = await toJson(custRes);

  ctx = {
    baseUrl,
    server,
    adminToken: adminJson.data.token,
    staffToken: staffJson.data.token,
    customerToken: custJson.data.token,
  };
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' STARTING BRIGHTLOOP ACCEPTANCE & INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(` ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(` ❌ FAIL: ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  }

  // Scenario 1: Customer registers with valid credentials and logs in
  await test('Scenario 1: Customer registration & login with password policy', async () => {
    const randomEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${ctx.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randomEmail,
        password: 'ValidPassword@123',
        name: 'Test Customer',
        companyName: 'Acme Corp',
      }),
    });
    const regData = await toJson(regRes);
    if (!regData.success) throw new Error(`Registration failed: ${regData.message}`);

    // Verify login
    const loginRes = await fetch(`${ctx.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password: 'ValidPassword@123' }),
    });
    const loginData = await toJson(loginRes);
    if (!loginData.success || !loginData.data?.token) throw new Error('Login failed for new user');

    // Test invalid password (must have special char, upper, lower, min 8)
    const badPassRes = await fetch(`${ctx.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `bad_${Date.now()}@example.com`,
        password: 'simplepassword',
        name: 'Bad Pass User',
      }),
    });
    const badPassData = await toJson(badPassRes);
    if (badPassData.success) throw new Error('Weak password was unexpectedly accepted');
  });

  // Scenario 2: Admin creates a new product with two variants
  let createdProductId = '';
  let variant1Id = '';
  let variant2Id = '';

  await test('Scenario 2: Admin creates product with two variants', async () => {
    const prodRes = await fetch(`${ctx.baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({
        name: `Test Suite Cloud App ${Date.now()}`,
        type: 'SOFTWARE',
        salesPrice: 250000, // ₹2,500.00
        costPrice: 50000,
        notes: 'Integration test product',
      }),
    });
    const prodData = await toJson(prodRes);
    if (!prodData.success) throw new Error(`Product creation failed: ${prodData.message}`);
    createdProductId = prodData.data.id;

    // Add variant 1 (Basic: +₹0)
    const var1Res = await fetch(`${ctx.baseUrl}/product-variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({
        productId: createdProductId,
        name: 'Standard Edition',
        additionalPrice: 0,
      }),
    });
    const var1Data = await toJson(var1Res);
    variant1Id = var1Data.data.id;

    // Add variant 2 (Enterprise Edition: +₹1000)
    const var2Res = await fetch(`${ctx.baseUrl}/product-variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({
        productId: createdProductId,
        name: 'Enterprise Edition',
        additionalPrice: 100000, // ₹1,000.00
      }),
    });
    const var2Data = await toJson(var2Res);
    variant2Id = var2Data.data.id;

    if (!variant1Id || !variant2Id) throw new Error('Failed to create variants');
  });

  // Scenario 3: Admin creates a monthly subscription plan
  let createdPlanId = '';
  await test('Scenario 3: Admin creates monthly subscription plan', async () => {
    const planRes = await fetch(`${ctx.baseUrl}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({
        name: `Automated Test Monthly Plan ${Date.now()}`,
        billingFrequency: 'MONTHLY',
        minimumQuantity: 1,
        allowEarlyClosure: true,
        allowPause: true,
        allowRenewal: true,
      }),
    });
    const planData = await toJson(planRes);
    if (!planData.success) throw new Error(`Plan creation failed: ${planData.message}`);
    createdPlanId = planData.data.id;
  });

  // Scenario 4: Staff selects template / creates quotation for customer
  let quotationId = '';
  let testCustomerId = '';
  await test('Scenario 4: Staff creates quotation for customer', async () => {
    // Get first customer
    const custsRes = await fetch(`${ctx.baseUrl}/customers?limit=1`, {
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const custsData = await toJson(custsRes);
    testCustomerId = custsData.data[0].id;

    // Get 18% GST rule
    const taxesRes = await fetch(`${ctx.baseUrl}/taxes`, {
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const taxesData = await toJson(taxesRes);
    const gst18 = taxesData.data.find((t: any) => t.rate === 1800) || taxesData.data[0];

    const quoteRes = await fetch(`${ctx.baseUrl}/quotations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.staffToken}`,
      },
      body: JSON.stringify({
        customerId: testCustomerId,
        planId: createdPlanId,
        paymentTerms: 'Immediate Payment',
        lines: [
          {
            productId: createdProductId,
            variantId: variant2Id,
            taxRuleId: gst18?.id,
            quantity: 2,
            unitPrice: 250000,
          },
        ],
      }),
    });
    const quoteData = await toJson(quoteRes);
    if (!quoteData.success) throw new Error(`Quotation creation failed: ${quoteData.message}`);
    quotationId = quoteData.data.id;
  });

  // Scenario 5: Quotation is confirmed, accepted and converted into a subscription
  let subscriptionId = '';
  await test('Scenario 5: Quotation status flow: DRAFT -> SENT -> ACCEPTED -> Subscription', async () => {
    // Confirm (DRAFT -> SENT)
    const confRes = await fetch(`${ctx.baseUrl}/quotations/${quotationId}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const confData = await toJson(confRes);
    if (confData.data.status !== 'SENT') throw new Error(`Expected SENT, got ${confData.data.status}`);

    // Accept (SENT -> ACCEPTED)
    const accRes = await fetch(`${ctx.baseUrl}/quotations/${quotationId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const accData = await toJson(accRes);
    if (accData.data.status !== 'ACCEPTED') throw new Error(`Expected ACCEPTED, got ${accData.data.status}`);

    // Convert to subscription
    const convRes = await fetch(`${ctx.baseUrl}/quotations/${quotationId}/convert`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const convData = await toJson(convRes);
    if (!convData.success || !convData.data.id) throw new Error(`Conversion failed: ${convData.message}`);
    subscriptionId = convData.data.id;
  });

  // Scenario 6 & 7: Subscription reaches billing date & scheduler generates invoice automatically
  let generatedInvoiceId = '';
  await test('Scenario 6 & 7: Billing engine identifies due subscription and generates invoice', async () => {
    // Set subscription nextBillingDate to yesterday to simulate due date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { nextBillingDate: yesterday, status: 'ACTIVE' },
    });

    // Run billing cycle
    const billRes = await fetch(`${ctx.baseUrl}/invoices/billing/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({ subscriptionId }),
    });
    const billData = await toJson(billRes);
    if (!billData.success || billData.data.invoicesCreated < 1) {
      throw new Error(`Billing did not create invoice: ${JSON.stringify(billData)}`);
    }
    generatedInvoiceId = billData.data.invoiceIds[0];
  });

  // Scenario 8 & 9: Taxes and eligible discounts are accurately calculated and displayed
  await test('Scenario 8 & 9: Taxes snapshot & discount calculations on generated invoice', async () => {
    const invRes = await fetch(`${ctx.baseUrl}/invoices/${generatedInvoiceId}`, {
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const invData = await toJson(invRes);
    const inv = invData.data;

    if (inv.subtotal <= 0) throw new Error('Invoice subtotal must be greater than 0');
    if (inv.taxAmount < 0) throw new Error('Invoice tax amount is invalid');
    if (inv.total !== inv.subtotal - inv.discountAmt + inv.taxAmount) {
      throw new Error(`Total mismatch: ${inv.total} !== ${inv.subtotal} - ${inv.discountAmt} + ${inv.taxAmount}`);
    }
  });

  // Scenario 10: Staff records a partial and then full payment against invoice
  await test('Scenario 10 & 11: Recording payments, outstanding update, and transition to PAID', async () => {
    // Confirm invoice first so payments can be accepted
    await fetch(`${ctx.baseUrl}/invoices/${generatedInvoiceId}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });

    // Fetch confirmed invoice
    const invRes = await fetch(`${ctx.baseUrl}/invoices/${generatedInvoiceId}`, {
      headers: { Authorization: `Bearer ${ctx.staffToken}` },
    });
    const inv = (await toJson(invRes)).data;
    const initialOutstanding = inv.outstanding;

    // Partial payment: 50%
    const partialAmount = Math.floor(initialOutstanding / 2);
    const pay1Res = await fetch(`${ctx.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.staffToken}`,
      },
      body: JSON.stringify({
        invoiceId: generatedInvoiceId,
        amount: partialAmount,
        method: 'UPI',
        notes: 'Partial payment test',
      }),
    });
    const pay1Data = await toJson(pay1Res);
    if (!pay1Data.success) throw new Error(`Partial payment failed: ${pay1Data.message}`);

    // Verify invoice is still CONFIRMED with reduced outstanding
    const check1 = await prisma.invoice.findUnique({ where: { id: generatedInvoiceId } });
    if (check1?.status !== 'CONFIRMED') throw new Error(`Expected CONFIRMED status after partial payment, got ${check1?.status}`);
    if (check1.outstanding !== initialOutstanding - partialAmount) {
      throw new Error(`Outstanding incorrect after partial payment: ${check1.outstanding}`);
    }

    // Pay remaining balance
    const remaining = check1.outstanding;
    const pay2Res = await fetch(`${ctx.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.staffToken}`,
      },
      body: JSON.stringify({
        invoiceId: generatedInvoiceId,
        amount: remaining,
        method: 'BANK_TRANSFER',
        notes: 'Final settlement',
      }),
    });
    const pay2Data = await toJson(pay2Res);
    if (!pay2Data.success) throw new Error(`Final payment failed: ${pay2Data.message}`);

    // Verify status is now PAID and outstanding is 0
    const check2 = await prisma.invoice.findUnique({ where: { id: generatedInvoiceId } });
    if (check2?.status !== 'PAID') throw new Error(`Expected PAID status after full settlement, got ${check2?.status}`);
    if (check2.outstanding !== 0) throw new Error(`Expected 0 outstanding, got ${check2.outstanding}`);
  });

  // Scenario 12: Finance dashboard reflects collected revenue and outstanding amounts accurately
  await test('Scenario 12: Finance dashboard server-side aggregation metrics', async () => {
    const dashRes = await fetch(`${ctx.baseUrl}/dashboard/kpis`, {
      headers: { Authorization: `Bearer ${ctx.adminToken}` },
    });
    const dashData = await toJson(dashRes);
    if (!dashData.success) throw new Error('Dashboard KPIs query failed');

    const kpis = dashData.data;
    if (typeof kpis.activeSubscriptions !== 'number') throw new Error('activeSubscriptions missing');
    if (typeof kpis.totalCustomers !== 'number') throw new Error('totalCustomers missing');
    if (typeof kpis.collectedRevenue !== 'number' || kpis.collectedRevenue <= 0) {
      throw new Error(`collectedRevenue expected > 0, got ${kpis.collectedRevenue}`);
    }
  });

  // Scenario 13: An expired or closed subscription does not generate an invoice
  await test('Scenario 13: Closed subscription does not generate invoice', async () => {
    // Close the test subscription
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CLOSED', nextBillingDate: new Date('2020-01-01') },
    });

    const billRes = await fetch(`${ctx.baseUrl}/invoices/billing/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({ subscriptionId }),
    });
    const billData = await toJson(billRes);
    if (billData.data.invoicesCreated !== 0) {
      throw new Error('Closed subscription generated an invoice!');
    }
  });

  // Scenario 14: Running billing process twice does not create duplicate invoices (Idempotency)
  await test('Scenario 14: Billing idempotency — second execution creates 0 duplicates', async () => {
    // Pick an active subscription from seed
    const activeSub = await prisma.subscription.findFirst({
      where: { status: 'ACTIVE' },
    });
    if (!activeSub) throw new Error('No active subscription found');

    // Run billing cycle once
    await fetch(`${ctx.baseUrl}/invoices/billing/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({ subscriptionId: activeSub.id }),
    });

    // Run billing cycle immediately a second time
    const secondRun = await fetch(`${ctx.baseUrl}/invoices/billing/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.adminToken}`,
      },
      body: JSON.stringify({ subscriptionId: activeSub.id }),
    });
    const secondData = await toJson(secondRun);

    if (secondData.data.invoicesCreated > 0) {
      throw new Error('Duplicate invoice created during second billing run!');
    }
  });

  // Scenario 15: Customer cannot access another customer records (Tenant isolation)
  await test('Scenario 15: Customer portal data isolation (cannot read other customer data)', async () => {
    // customer1 tries to access all subscriptions from admin route -> 403 Forbidden
    const forbiddenRes = await fetch(`${ctx.baseUrl}/subscriptions`, {
      headers: { Authorization: `Bearer ${ctx.customerToken}` },
    });
    if (forbiddenRes.status !== 403) {
      throw new Error(`Expected 403 for customer accessing admin endpoint, got ${forbiddenRes.status}`);
    }

    // In customer portal, overview only returns their own customer record
    const portalRes = await fetch(`${ctx.baseUrl}/customer-portal/overview`, {
      headers: { Authorization: `Bearer ${ctx.customerToken}` },
    });
    const portalData = await toJson(portalRes);
    if (portalData.data.customer.user.email !== 'customer1@example.com') {
      throw new Error(`Data leakage! Expected customer1, got ${portalData.data.customer.user.email}`);
    }
  });

  // Scenario 16: Staff member cannot create staff accounts or modify admin settings
  await test('Scenario 16: Staff RBAC boundaries — forbidden from creating staff or discount rules', async () => {
    // Staff attempts to create staff account -> 403
    const staffCreateRes = await fetch(`${ctx.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.staffToken}`,
      },
      body: JSON.stringify({
        email: `hacker_${Date.now()}@example.com`,
        password: 'Password@123',
        role: 'STAFF',
      }),
    });
    if (staffCreateRes.status !== 403) {
      throw new Error(`Expected 403 when staff creates user, got ${staffCreateRes.status}`);
    }

    // Staff attempts to create discount rule -> 403
    const discountRes = await fetch(`${ctx.baseUrl}/discounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.staffToken}`,
      },
      body: JSON.stringify({
        name: 'Unauthorized Staff Discount',
        type: 'PERCENTAGE',
        value: 5000,
      }),
    });
    if (discountRes.status !== 403) {
      throw new Error(`Expected 403 when staff creates discount, got ${discountRes.status}`);
    }
  });

  console.log('\n======================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  ctx.server.close();

  if (failed > 0) {
    process.exit(1);
  }
}

setup().then(runTests).catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
