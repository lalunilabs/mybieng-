import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const { conversationId, mode, contextType, contextId, message, role, metadata } = body;

    if (!message || !role) {
      return NextResponse.json(
        { error: 'Message and role are required' },
        { status: 400 }
      );
    }

    const userId = session?.user ? (session.user as any).id : null;
    const sessionId = !userId ? request.headers.get('x-session-id') || undefined : undefined;

    // Create or update conversation
    let conversation;
    if (conversationId) {
      // Add message to existing conversation
      conversation = await prisma!.aIConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new conversation
      conversation = await prisma!.aIConversation.create({
        data: {
          userId,
          sessionId,
          mode: mode || 'general',
          contextType,
          contextId,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    }

    // Save message
    const savedMessage = await prisma!.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role,
        content: message,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messageId: savedMessage.id,
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}
