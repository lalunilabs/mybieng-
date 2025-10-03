import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    console.log('📊 Tables found:', tables)
    
    // Test basic query
    const userCount = await prisma.user.count()
    console.log('👥 User count:', userCount)
    
    await prisma.$disconnect()
    console.log('✅ Database check complete')
    
  } catch (error) {
    console.error('❌ Database error:', error)
    process.exit(1)
  }
}

checkDatabase()
