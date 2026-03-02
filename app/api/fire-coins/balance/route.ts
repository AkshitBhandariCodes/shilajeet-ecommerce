import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import FireCoins from '@/models/FireCoins';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let fireCoins = await FireCoins.findOne({ userId: session.user.email });
    
    if (!fireCoins) {
      fireCoins = await FireCoins.create({
        userId: session.user.email,
        balance: 0,
        transactions: []
      });
    }

    return NextResponse.json({
      balance: fireCoins.balance,
      transactions: fireCoins.transactions
    });
  } catch (error) {
    console.error('Error fetching fire coins balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
