import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import Newsletter from '@/models/Newsletter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    if (!session.user.id) {
      return NextResponse.json({ error: 'Unauthorized - No user ID' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Forbidden - User not found',
      }, { status: 403 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required',
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30days';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        previousStartDate.setDate(now.getDate() - 180);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
    }

    // Current period orders
    const currentOrders = await Order.find({
      createdAt: { $gte: startDate }
    });

    // Previous period orders
    const previousOrders = await Order.find({
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });

    // Calculate revenue
    const currentRevenue = currentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Calculate orders growth
    const ordersGrowth = previousOrders.length > 0
      ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100
      : 0;

    // Calculate new customers
    const currentCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startDate }
    });
    const previousCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });
    const customersGrowth = previousCustomers > 0
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0;

    // Calculate average order value
    const currentAvgOrderValue = currentOrders.length > 0
      ? currentRevenue / currentOrders.length
      : 0;
    const previousAvgOrderValue = previousOrders.length > 0
      ? previousRevenue / previousOrders.length
      : 0;
    const avgOrderValueGrowth = previousAvgOrderValue > 0
      ? ((currentAvgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100
      : 0;

    // Top products
    const productSales: any = {};
    currentOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.productId?.toString() || item.name;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.name || 'Unknown Product',
              sales: 0,
              revenue: 0
            };
          }
          productSales[productId].sales += item.quantity || 0;
          productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p: any) => ({
        name: p.name || 'Unknown',
        sales: p.sales || 0,
        revenue: p.revenue || 0
      }));

    // Sales by category
    const products = await Product.find({});
    const categoryMap: any = {};
    products.forEach(product => {
      categoryMap[product._id.toString()] = product.category || 'Other';
    });

    const categorySales: any = {};
    currentOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const category = categoryMap[item.productId?.toString()] || 'Other';
          if (!categorySales[category]) {
            categorySales[category] = 0;
          }
          categorySales[category] += item.quantity || 0;
        });
      }
    });

    const totalCategorySales = Object.values(categorySales).reduce((sum: any, count: any) => sum + count, 0) as number;
    const salesByCategory = Object.entries(categorySales)
      .map(([category, count]: any) => ({
        category: category || 'Other',
        count: count || 0,
        percentage: totalCategorySales > 0 ? Math.round((count / totalCategorySales) * 100) : 0
      }))
      .filter(item => item.count > 0);

    // Recent activity
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');

    const recentCustomers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(3);

    const recentActivity = [
      ...recentOrders.slice(0, 2).map(order => ({
        type: 'order',
        description: `New order ${order.orderNumber || 'N/A'}`,
        time: getTimeAgo(order.createdAt)
      })),
      ...recentCustomers.slice(0, 2).map(customer => ({
        type: 'customer',
        description: `New customer: ${customer.name || 'Unknown'}`,
        time: getTimeAgo(customer.createdAt)
      }))
    ].sort((a, b) => {
      // Sort by most recent
      return 0;
    }).slice(0, 4);

    const analytics = {
      revenue: {
        current: currentRevenue || 0,
        previous: previousRevenue || 0,
        growth: revenueGrowth || 0
      },
      orders: {
        current: currentOrders.length || 0,
        previous: previousOrders.length || 0,
        growth: ordersGrowth || 0
      },
      customers: {
        current: currentCustomers || 0,
        previous: previousCustomers || 0,
        growth: customersGrowth || 0
      },
      avgOrderValue: {
        current: currentAvgOrderValue || 0,
        previous: previousAvgOrderValue || 0,
        growth: avgOrderValueGrowth || 0
      },
      topProducts: topProducts.length > 0 ? topProducts : [
        { name: 'No sales yet', sales: 0, revenue: 0 }
      ],
      salesByCategory: salesByCategory.length > 0 ? salesByCategory : [
        { category: 'No sales yet', count: 0, percentage: 0 }
      ],
      recentActivity: recentActivity.length > 0 ? recentActivity : [
        { type: 'info', description: 'No recent activity', time: 'N/A' }
      ]
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
