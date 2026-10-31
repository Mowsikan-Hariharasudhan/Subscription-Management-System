import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

export const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

export default prisma;
