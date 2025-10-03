import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { migrateAnonymousData } from '@/lib/sessionMigration';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await migrateAnonymousData(session.user.email);
    
    return NextResponse.json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json({ 
      error: 'Migration failed' 
    }, { status: 500 });
  }
}
