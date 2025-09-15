const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLoggedInUserBookmarks() {
  try {
    console.log('Testing bookmark functionality for logged-in users...');
    
    // Test with our test user
    const userId = 'test-user-id';
    const sessionId = 'test-session-id';
    
    console.log(`User ID: ${userId}`);
    console.log(`Session ID: ${sessionId}`);
    
    // Test fetching bookmarks for logged-in user
    // The API prioritizes userId over sessionId when both are available
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Bookmarks for logged-in user:', bookmarks);
    
    // Test creating a new bookmark for logged-in user
    const newBookmark = await prisma.bookmark.create({
      data: {
        userId,
        sessionId, // Still store sessionId for consistency
        type: 'quiz',
        itemId: 'self-awareness-mixed',
        title: 'Self-Awareness Check (Mixed Format)'
      }
    });
    
    console.log('Created new bookmark for logged-in user:', newBookmark);
    
    // Verify the new bookmark is associated with the user
    const updatedBookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Updated bookmarks for logged-in user:', updatedBookmarks);
    
    // Clean up - delete the test bookmark
    await prisma.bookmark.delete({
      where: { id: newBookmark.id }
    });
    
    console.log('Cleaned up test bookmark');
    
  } catch (error) {
    console.error('Error testing logged-in user bookmarks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLoggedInUserBookmarks();
