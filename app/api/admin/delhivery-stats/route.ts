import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function checkAdmin(session: any) {
  if (!session?.user?.id) {
    return false;
  }

  await dbConnect();
  const user = await User.findById(session.user.id);
  return user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate shipment statistics
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          shippingProvider: 'delhivery',
        },
      },
      {
        $group: {
          _id: '$trackingStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    // Get detailed breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          shippingProvider: 'delhivery',
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    // Get payment mode breakdown
    const paymentBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          shippingProvider: 'delhivery',
        },
      },
      {
        $group: {
          _id: '$payment.mode',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    // Calculate totals
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      shippingProvider: 'delhivery',
    });

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          shippingProvider: 'delhivery',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Get recent orders
    const recentOrders = await Order.find({
      createdAt: { $gte: startDate },
      shippingProvider: 'delhivery',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email phone')
      .select('orderNumber trackingNumber trackingStatus status payment.mode total createdAt');

    return NextResponse.json({
      success: true,
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        dateRange: {
          start: startDate,
          end: new Date(),
          days,
        },
      },
      trackingStatus: stats,
      orderStatus: statusBreakdown,
      paymentMode: paymentBreakdown,
      recentOrders,
    });
  } catch (error: any) {
    console.error('Error fetching Delhivery stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
