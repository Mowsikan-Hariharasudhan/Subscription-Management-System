import cron from 'node-cron';
import { BillingService } from '../services/billingService';

export const startBillingJob = () => {
  // Schedule every day at 00:01
  const job = cron.schedule('1 0 * * *', async () => {
    console.log('[CRON] Starting automated daily billing cycle run...');
    try {
      const result = await BillingService.runBillingCycle();
      console.log(
        `[CRON] Billing run completed: ${result.invoicesCreated} invoices created, ${result.skipped} skipped, ${result.errors.length} errors.`
      );
    } catch (err) {
      console.error('[CRON] Billing job failed with error:', err);
    }
  });

  console.log('[CRON] Daily billing job registered (runs daily at 00:01)');
  return job;
};

