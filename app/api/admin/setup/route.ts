import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get setup key from environment or request
    const setupKey = request.headers.get('x-setup-key');
    const envSetupKey = process.env.SETUP_KEY || 'setup-key-12345';

    if (setupKey !== envSetupKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // Update to admin if not already
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        return NextResponse.json({
          success: true,
          message: 'User updated to admin role',
          user: {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
          },
        });
      }

      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      name: name || 'Admin User',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      authMethod: 'email',
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set up admin' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const setupKey = request.headers.get('x-setup-key');
    const envSetupKey = process.env.SETUP_KEY || 'setup-key-12345';

    if (setupKey !== envSetupKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    return NextResponse.json({
      adminExists: !!adminExists,
      adminEmail: adminExists?.email || null,
      setupRequired: !adminExists,
    });
  } catch (error: any) {
    console.error('Error checking admin setup:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check admin setup' },
      { status: 500 }
    );
  }
}
