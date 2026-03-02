import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTPSession from '@/models/OTPSession';
import User from '@/models/User';
import Coupon from '@/models/Coupon';
import authKeySMS from '@/lib/authkey-sms';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const { otp, logId, phoneNumber, purpose = 'signin', firstName, lastName, email } = await request.json();

    // Validation
    if (!otp || !logId) {
      return NextResponse.json(
        { error: 'OTP and LogID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find OTP session
    const otpSession = await OTPSession.findOne({ logId });

    if (!otpSession) {
      return NextResponse.json(
        { error: 'Invalid OTP session' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (new Date() > otpSession.expiresAt) {
      await OTPSession.deleteOne({ _id: otpSession._id });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempt limit
    if (otpSession.attempts >= otpSession.maxAttempts) {
      await OTPSession.deleteOne({ _id: otpSession._id });
      return NextResponse.json(
        { error: 'Maximum OTP attempts exceeded. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP against stored OTP
    if (otp !== otpSession.otp) {
      // Increment attempts
      otpSession.attempts += 1;
      await otpSession.save();

      return NextResponse.json(
        { 
          error: 'Invalid OTP',
          attemptsRemaining: otpSession.maxAttempts - otpSession.attempts,
        },
        { status: 400 }
      );
    }

    // OTP verified successfully
    otpSession.isVerified = true;
    await otpSession.save();

    // Handle signup
    if (purpose === 'signup') {
      if (!firstName || !lastName || !email) {
        return NextResponse.json(
          { error: 'First name, last name, and email are required for signup' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { phone: otpSession.phoneNumber },
        ],
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const user = new User({
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        phone: otpSession.phoneNumber,
        phoneVerified: true,
        authMethod: 'phone',
        password: '', // No password for phone auth
        role: 'customer',
        isVerified: true,
      });

      await user.save();

      // Generate unique welcome coupon code for this user
      const welcomeCouponCode = `WELCOME5${user._id.toString().slice(-6).toUpperCase()}`;
      
      // Create welcome coupon (5% discount)
      const welcomeCoupon = new Coupon({
        code: welcomeCouponCode,
        description: `Welcome bonus - 5% off on your first order`,
        discountType: 'percentage',
        discountValue: 5,
        minOrderAmount: 0,
        maxDiscount: 500, // Max ₹500 discount
        maxUses: 1, // Can only be used once
        active: true,
        createdBy: user._id,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
      });

      await welcomeCoupon.save();

      // Update user with signup discount code
      user.signupDiscountCode = welcomeCouponCode;
      await user.save();

      // Clean up OTP session
      await OTPSession.deleteOne({ _id: otpSession._id });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          signupDiscountCode: welcomeCouponCode,
        },
      });
    }

    // Handle signin
    if (purpose === 'signin') {
      const user = await User.findOne({ phone: otpSession.phoneNumber });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update phone verification status
      user.phoneVerified = true;
      await user.save();

      // Clean up OTP session
      await OTPSession.deleteOne({ _id: otpSession._id });

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    // Handle password reset
    if (purpose === 'password-reset') {
      const user = await User.findOne({ phone: otpSession.phoneNumber });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Clean up OTP session
      await OTPSession.deleteOne({ _id: otpSession._id });

      return NextResponse.json({
        success: true,
        message: 'OTP verified. You can now reset your password.',
        user: {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid purpose' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
