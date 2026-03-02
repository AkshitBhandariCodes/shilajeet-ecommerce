import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all customers (non-admin users)
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get order counts for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ userId: customer._id });
        const totalSpent = await Order.aggregate([
          { $match: { userId: customer._id } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || '',
          joinDate: customer.createdAt,
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
          isVerified: customer.isVerified || false,
        };
      })
    );

    return NextResponse.json(customersWithStats);

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}