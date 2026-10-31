import { createApp } from './app';
import { env } from './config/env';
import { initDbPragmas } from './config/prisma';
import { startBillingJob } from './jobs/billingJob';

const startServer = async () => {
  try {
    // 1. Initialize SQLite Pragmas
    await initDbPragmas();

    // 2. Start Scheduled Cron Jobs
    startBillingJob();

    // 3. Create Express App
    const app = createApp();

    // 4. Start HTTP Server
    const server = app.listen(env.PORT, () => {
      console.log(`\n========================================================`);
      console.log(` Brightloop Server is running on http://localhost:${env.PORT}`);
      console.log(` API Base URL: http://localhost:${env.PORT}/api/v1`);
      console.log(` Environment: ${env.NODE_ENV}`);
      console.log(`========================================================\n`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${env.PORT} is already in use by another process.`);
        console.error(`👉 Run 'kill_ports.bat' to free port ${env.PORT} and try again.\n`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Fatal error starting Brightloop Server:', error);
    process.exit(1);
  }
};

startServer();
