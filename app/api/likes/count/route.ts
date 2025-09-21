import { prisma, safeDbOperation } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, itemId } = await request.json();
    
    const count = await safeDbOperation(
      () => prisma!.like.count({
        where: { type, itemId },
      }),
      0
    );
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching like count:', error);
    return NextResponse.json({ count: 0 });
  }
}
