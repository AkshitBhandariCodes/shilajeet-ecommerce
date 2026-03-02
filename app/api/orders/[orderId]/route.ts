import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import delhiveryService from '@/lib/delhivery';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Try to find by orderNumber first, then by MongoDB _id
    let order = await Order.findOne({
      orderNumber: params.orderId,
      userId: session.user.id
    }).select('-payment.cardNumber -payment.transactionId');

    if (!order) {
      // Try MongoDB _id
      order = await Order.findOne({
        _id: params.orderId,
        userId: session.user.id
      }).select('-payment.cardNumber -payment.transactionId');
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch Delhivery tracking data if waybill exists
    if (order.trackingNumber) {
      try {
        const trackingData = await delhiveryService.trackShipment(order.trackingNumber, order.orderNumber);
        
        if (trackingData.success && trackingData.data) {
          const shipmentData = Array.isArray(trackingData.data) ? trackingData.data[0] : trackingData.data;
          
          if (shipmentData) {
            // Update order with latest tracking info
            order.delhiveryData = {
              waybill: order.trackingNumber,
              currentStatus: shipmentData.status,
              lastUpdate: new Date(),
              scans: shipmentData.scans || [],
            };

            // Update shipping stats
            if (shipmentData.scans && shipmentData.scans.length > 0) {
              const lastScan = shipmentData.scans[shipmentData.scans.length - 1];
              order.shippingStats = {
                lastLocation: lastScan.location,
                estimatedDelivery: shipmentData.expected_delivery_date ? new Date(shipmentData.expected_delivery_date) : undefined,
              };
            }

            await order.save();
          }
        }
      } catch (trackingError) {
        console.error('Error fetching Delhivery tracking:', trackingError);
        // Continue without tracking data
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
