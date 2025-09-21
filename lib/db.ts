import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Create a safe database connection that handles build-time gracefully
function createPrismaClient() {
  // During build, if no DATABASE_URL is provided, return a mock client
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    console.warn('No DATABASE_URL found during build - using mock client');
    return null;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// Safe database operation wrapper
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!prisma) {
    console.warn('Database not available - returning fallback value');
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return fallback;
  }
}
