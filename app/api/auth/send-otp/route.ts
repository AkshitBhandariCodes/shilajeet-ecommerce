import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTPSession from '@/models/OTPSession';
import User from '@/models/User';
import authKeySMS from '@/lib/authkey-sms';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, countryCode = '91', purpose = 'signin' } = await request.json();

    // Validation
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists (for signin)
    if (purpose === 'signin') {
      const user = await User.findOne({ phone: cleanPhone });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found. Please sign up first.' },
          { status: 404 }
        );
      }
    }

    // Check if user exists (for signup)
    if (purpose === 'signup') {
      const user = await User.findOne({ phone: cleanPhone });
      if (user) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        );
      }
    }

    // Delete any existing OTP sessions for this phone
    await OTPSession.deleteMany({ phoneNumber: cleanPhone });

    // Send OTP via AuthKey.io with company name
    const otpResponse = await authKeySMS.sendOTP(cleanPhone, countryCode, 'Agnishila');

    if (!otpResponse.success || !otpResponse.logId) {
      return NextResponse.json(
        { error: otpResponse.error || 'Failed to send OTP' },
        { status: 500 }
      );
    }

    // Create OTP session with the generated OTP
    const otpSession = new OTPSession({
      phoneNumber: cleanPhone,
      logId: otpResponse.logId,
      otp: otpResponse.otp, // Store the generated OTP
      purpose,
      metadata: {
        countryCode,
        sentAt: new Date(),
      },
    });

    await otpSession.save();

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      logId: otpResponse.logId,
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
