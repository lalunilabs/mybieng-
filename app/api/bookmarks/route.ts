import { prisma, safeDbOperation } from '@/lib/db';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id as string | undefined;
    const sessionId = cookies().get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json([]);
    }
    
    const bookmarks = await safeDbOperation(
      () => prisma!.bookmark.findMany({
        where: userId 
          ? { userId }
          : { sessionId },
        orderBy: { createdAt: 'desc' },
      }),
      []
    );
    
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
