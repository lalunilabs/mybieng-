import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserEntitlements } from '@/lib/middleware/entitlements';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        {
          isPremium: false,
          subscription: null,
          aiAccess: { unlimited: false, canUse: true }, // Free users get limited AI
          features: {
            premiumArticles: false,
            freeQuizzes: false,
            discountedQuizzes: false,
            unlimitedAI: false,
          },
        },
        { status: 200 }
      );
    }

    const userId = (session.user as any).id;
    const entitlements = await getUserEntitlements(userId);

    return NextResponse.json(entitlements);
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entitlements' },
      { status: 500 }
    );
  }
}
