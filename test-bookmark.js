const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBookmark() {
  try {
    // First create a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });
    
    console.log('Created user:', user);
    
    // Test creating a bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        type: 'quiz',
        itemId: 'test-quiz',
        title: 'Test Quiz',
        userId: user.id
      }
    });
    
    console.log('Created bookmark:', bookmark);
    
    // Test finding bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id
      }
    });
    
    console.log('Found bookmarks:', bookmarks);
    
    // Test deleting the bookmark
    await prisma.bookmark.delete({
      where: {
        id: bookmark.id
      }
    });
    
    console.log('Deleted bookmark');
    
    // Delete the user
    await prisma.user.delete({
      where: {
        id: user.id
      }
    });
    
    console.log('Deleted user');
  } catch (error) {
    console.error('Error testing bookmark:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookmark();
