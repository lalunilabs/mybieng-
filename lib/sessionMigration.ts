import { prisma, safeDbOperation } from '@/lib/db';
import { cookies } from 'next/headers';

export async function migrateAnonymousData(userId: string) {
  const sessionId = cookies().get('sessionId')?.value;
  
  if (!sessionId) {
    return { migrated: 0, message: 'No anonymous session found' };
  }

  return await safeDbOperation(async () => {
    const anonymousRuns = await prisma!.quizRun.findMany({
      where: { sessionId }
    });

    if (anonymousRuns.length === 0) {
      return { migrated: 0, message: 'No data to migrate' };
    }

    await prisma!.quizRun.updateMany({
      where: { sessionId },
      data: { userId, sessionId: undefined }
    });

    cookies().delete('sessionId');

    return { 
      migrated: anonymousRuns.length, 
      message: `Successfully migrated ${anonymousRuns.length} quiz runs` 
    };
  }, { migrated: 0, message: 'Migration failed' });
}

export async function getAnonymousDataCount(sessionId: string) {
  return await safeDbOperation(async () => {
    return await prisma!.quizRun.count({
      where: { sessionId }
    });
  }, 0);
}
