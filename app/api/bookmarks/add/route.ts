import { prisma, safeDbOperation } from '@/lib/db';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, itemId, title } = await request.json();
    
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id as string | undefined;
    const sessionId = cookies().get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 });
    }
    
    // Check if already bookmarked
    const existingBookmark = await safeDbOperation(
      () => prisma!.bookmark.findFirst({
        where: userId 
          ? { userId, type, itemId }
          : { sessionId, type, itemId },
      }),
      null
    );
    
    if (existingBookmark) {
      return NextResponse.json(existingBookmark);
    }
    
    const bookmark = await safeDbOperation(
      () => prisma!.bookmark.create({
        data: {
          userId,
          sessionId,
          type,
          itemId,
          title,
        },
      }),
      null
    );
    
    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
