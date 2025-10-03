import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const conversationId = searchParams.get('conversationId');
    const contextType = searchParams.get('contextType');
    const contextId = searchParams.get('contextId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const userId = session?.user ? (session.user as any).id : null;
    const sessionId = !userId ? request.headers.get('x-session-id') || undefined : undefined;

    // Get specific conversation
    if (conversationId) {
      const conversation = await prisma!.aIConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: limit,
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      // Verify access
      if (conversation.userId !== userId && conversation.sessionId !== sessionId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      return NextResponse.json(conversation);
    }

    // Get conversations by context
    if (contextType && contextId) {
      const conversations = await prisma!.aIConversation.findMany({
        where: {
          ...(userId ? { userId } : { sessionId }),
          contextType,
          contextId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: limit,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Max 10 conversations
      });

      return NextResponse.json({ conversations });
    }

    // Get user's recent conversations
    const conversations = await prisma!.aIConversation.findMany({
      where: userId ? { userId } : { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Only last message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

// Delete a conversation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    const userId = session?.user ? (session.user as any).id : null;
    const sessionId = !userId ? request.headers.get('x-session-id') || undefined : undefined;

    // Verify ownership before deleting
    const conversation = await prisma!.aIConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversation.userId !== userId && conversation.sessionId !== sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete conversation (messages will cascade delete)
    await prisma!.aIConversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
