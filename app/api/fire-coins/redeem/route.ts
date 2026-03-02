import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import FireCoins from '@/models/FireCoins';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, orderId, description } = await request.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const fireCoins = await FireCoins.findOne({ userId: session.user.email });
    
    if (!fireCoins) {
      return NextResponse.json(
        { error: 'No fire coins account found' },
        { status: 404 }
      );
    }

    // Check if user has enough coins
    if (fireCoins.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient fire coins balance' },
        { status: 400 }
      );
    }

    // Add transaction
    fireCoins.transactions.push({
      type: 'redeemed',
      amount,
      orderId,
      description: description || `Redeemed ${amount} Fire Coins for ₹${amount} discount`,
      createdAt: new Date()
    });

    // Update balance
    fireCoins.balance -= amount;

    await fireCoins.save();

    return NextResponse.json({
      success: true,
      balance: fireCoins.balance,
      redeemed: amount
    });
  } catch (error) {
    console.error('Error redeeming fire coins:', error);
    return NextResponse.json(
      { error: 'Failed to redeem coins' },
      { status: 500 }
    );
  }
}
