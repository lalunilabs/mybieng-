import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, fetch from database
    // const results = await prisma.quizResult.findMany({
    //   where: { userId: session.user.email },
    //   orderBy: { completedAt: 'desc' }
    // });

    // Mock data for now
    const mockResults = [
      {
        id: '1',
        quizTitle: 'Cognitive Dissonance Assessment',
        score: 28,
        maxScore: 40,
        band: 'Moderate Dissonance',
        completedAt: new Date('2024-01-15'),
        insights: [
          'You show healthy awareness of internal conflicts',
          'Consider exploring value-behavior alignment'
        ]
      }
    ];

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quizId, answers, score, maxScore, band } = body;

    // Save quiz result to database
    // const result = await prisma.quizResult.create({
    //   data: {
    //     userId: session.user.email,
    //     quizId,
    //     answers: JSON.stringify(answers),
    //     score,
    //     maxScore,
    //     band,
    //     completedAt: new Date()
    //   }
    // });

    // Mock save for now
    const result = {
      id: `result_${Date.now()}`,
      userId: session.user.email,
      quizId,
      score,
      maxScore,
      band,
      completedAt: new Date()
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz result' },
      { status: 500 }
    );
  }
}
