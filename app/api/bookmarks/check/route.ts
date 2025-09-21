import { prisma, safeDbOperation } from '@/lib/db';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, sessionId, type, itemId } = await request.json();
    
    const session = await getServerSession(authOptions);
    const currentUserId = (session as any)?.user?.id as string | undefined;
    const currentSessionId = cookies().get('sessionId')?.value;
    
    // Validate that the request is for the current user/session
    if ((userId && userId !== currentUserId) || (sessionId && sessionId !== currentSessionId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const where = userId 
      ? { userId, type, itemId }
      : { sessionId: currentSessionId, type, itemId };
    
    const bookmark = await safeDbOperation(
      () => prisma!.bookmark.findFirst({
        where,
        select: { id: true },
      }),
      null
    );
    
    return NextResponse.json({
      exists: !!bookmark,
      id: bookmark?.id || null,
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
