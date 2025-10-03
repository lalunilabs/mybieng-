import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Mock client for when database isn't configured
const createMockClient = () => {
  return {
    user: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async (data: any) => ({ id: 'mock-user', ...data }),
      count: async () => 0,
    },
    quizRun: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async (data: any) => ({ id: 'mock-run', ...data }),
      count: async () => 0,
      update: async () => ({}),
      updateMany: async () => ({}),
    },
    quizAnswer: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'mock-answer', ...data }),
      createMany: async () => ({ count: 0 }),
    },
    subscription: {
      findUnique: async () => null,
      findFirst: async () => null,
      findMany: async () => [],
      create: async ({ data }: any) => ({ id: 'mock-sub', ...data }),
      update: async ({ data }: any) => ({ id: 'mock-sub', ...data }),
      upsert: async ({ create, update }: any) => ({ id: 'mock-sub', ...(update || create) }),
      delete: async () => ({}),
    },
    manualDiscount: {
      findFirst: async () => null,
      update: async ({ data }: any) => ({ id: 'mock-discount', ...data }),
      create: async ({ data }: any) => ({ id: 'mock-discount', ...data }),
    },
    purchase: {
      findFirst: async () => null,
      findMany: async () => [],
      create: async ({ data }: any) => ({ id: 'mock-purchase', ...data }),
      count: async () => 0,
    },
    emailLog: {
      create: async ({ data }: any) => ({ id: 'mock-email', status: data?.status || 'sent', ...data }),
      update: async ({ where, data }: any) => ({ id: where?.id || 'mock-email', ...data }),
      findMany: async () => [],
    },
    newsletter: {
      create: async (data: any) => ({ id: 'mock-subscriber', ...data }),
      count: async () => 0,
    },
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: async (fn: any) => fn(this),
  } as unknown as PrismaClient;
};

// Create a safe database connection that handles build-time gracefully
function createPrismaClient() {
  // During build, if no DATABASE_URL is provided, return a mock client
  if (!process.env.DATABASE_URL) {
    console.warn('No DATABASE_URL found - using mock client');
    return createMockClient();
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
    return createMockClient();
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
