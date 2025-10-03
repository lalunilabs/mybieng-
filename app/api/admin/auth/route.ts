import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secure admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@mybeing.com',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5Qk5s2fxeO', // 'admin123'
  secretKey: process.env.ADMIN_SECRET_KEY || 'mybeing-research-2024'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret';

export async function POST(request: NextRequest) {
  try {
    const { email, password, secretKey } = await request.json();

    // Validate all required fields
    if (!email || !password || !secretKey) {
      return NextResponse.json(
        { error: 'All credentials required' },
        { status: 400 }
      );
    }

    // Multi-layer authentication
    const isEmailValid = email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();
    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    const isSecretKeyValid = secretKey === ADMIN_CREDENTIALS.secretKey;

    if (!isEmailValid || !isPasswordValid || !isSecretKeyValid) {
      // Log failed attempt (in production, implement rate limiting)
      console.log(`Failed admin login attempt: ${email} at ${new Date().toISOString()}`);
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate secure JWT token
    const token = jwt.sign(
      { 
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      JWT_SECRET
    );

    // Log successful login
    console.log(`Successful admin login: ${email} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: ADMIN_CREDENTIALS.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Verify admin token endpoint
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
