import { prisma, safeDbOperation } from '@/lib/db';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bookmarkId } = await request.json();
    
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id as string | undefined;
    const sessionId = cookies().get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 });
    }
    
    // Verify the bookmark belongs to the current user/session
    const bookmark = await safeDbOperation(
      () => prisma!.bookmark.findUnique({
        where: { id: bookmarkId },
      }),
      null
    );
    
    if (!bookmark) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    }
    
    if ((userId && bookmark.userId !== userId) || (!userId && bookmark.sessionId !== sessionId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await safeDbOperation(
      () => prisma!.bookmark.delete({
        where: { id: bookmarkId },
      }),
      null
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
