import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const getDatabaseUrl = (): string => {
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const cleanPath = rawUrl.replace(/^file:/, '');
  
  if (path.isAbsolute(cleanPath)) {
    return cleanPath;
  }
  const cwd = process.cwd();
  if (cwd.endsWith('server')) {
    return path.resolve(cwd, cleanPath);
  }
  return path.resolve(cwd, 'server', cleanPath);
};

const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });

export const prisma =
  global.__prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export const initDbPragmas = async (): Promise<void> => {
  try {
    await prisma.$executeRawUnsafe('PRAGMA journal_mode = WAL;');
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
  } catch (err) {
    console.error('Failed to set SQLite PRAGMAs:', err);
  }
};
