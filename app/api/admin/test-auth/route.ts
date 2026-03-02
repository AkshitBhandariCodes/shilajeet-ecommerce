import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        message: 'You are not logged in'
      }, { status: 401 });
    }

    if (!session.user?.id) {
      return NextResponse.json({ 
        error: 'No user ID in session',
        session: session
      }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        sessionUserId: session.user.id
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session: {
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        userRole: session.user.role
      },
      database: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role
      },
      isAdmin: user.role === 'admin'
    });

  } catch (error: any) {
    console.error('Test Auth Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
