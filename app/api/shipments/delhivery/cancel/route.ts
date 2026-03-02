import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { waybill } = await request.json();

    if (!waybill) {
      return NextResponse.json({ error: 'Waybill is required' }, { status: 400 });
    }

    await dbConnect();

    const result = await shiprocketService.cancelShipment(waybill);

    // Update order status if needed
    const order = await Order.findOne({ trackingNumber: waybill });
    if (order) {
      order.trackingStatus = 'cancelled';
      await order.save();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error cancelling shipment:', error);
    return NextResponse.json({
      error: error.message || 'Failed to cancel shipment'
    }, { status: 500 });
  }
}
