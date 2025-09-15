import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, itemId } = await request.json();
    
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id as string | undefined;
    const sessionId = cookies().get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 });
    }
    
    const existingLike = await prisma.like.findFirst({
      where: userId 
        ? { userId, type, itemId }
        : { sessionId, type, itemId },
    });
    
    if (!existingLike) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }
    
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
