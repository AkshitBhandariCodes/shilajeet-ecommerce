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

    let fireCoins = await FireCoins.findOne({ userId: session.user.email });
    
    if (!fireCoins) {
      fireCoins = new FireCoins({
        userId: session.user.email,
        balance: 0,
        transactions: []
      });
    }

    // Add transaction
    fireCoins.transactions.push({
      type: 'earned',
      amount,
      orderId,
      description: description || `Earned ${amount} Fire Coins from order`,
      createdAt: new Date()
    });

    // Update balance
    fireCoins.balance += amount;

    await fireCoins.save();

    return NextResponse.json({
      success: true,
      balance: fireCoins.balance,
      earned: amount
    });
  } catch (error) {
    console.error('Error earning fire coins:', error);
    return NextResponse.json(
      { error: 'Failed to earn coins' },
      { status: 500 }
    );
  }
}
