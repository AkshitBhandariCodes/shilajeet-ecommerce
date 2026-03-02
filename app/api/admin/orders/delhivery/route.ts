import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import delhiveryService from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

async function checkAdmin(session: any) {
  if (!session?.user?.id) {
    return false;
  }

  await dbConnect();
  const user = await User.findById(session.user.id);
  return user?.role === 'admin';
}

// Update order tracking status from Delhivery
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, orderId, waybill } = await request.json();

    if (!action || !orderId) {
      return NextResponse.json(
        { error: 'Action and Order ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const trackingWaybill = waybill || order.trackingNumber;
    if (!trackingWaybill) {
      return NextResponse.json(
        { error: 'No tracking number available' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'cancel':
        result = await delhiveryService.cancelShipment(trackingWaybill);
        if (result.success) {
          order.status = 'cancelled';
          order.trackingStatus = 'failed';
          await order.save();
        }
        break;

      case 'track':
        result = await delhiveryService.trackShipment(trackingWaybill, order.orderNumber);
        if (result.success && result.data && result.data.length > 0) {
          const shipment = result.data[0];
          const statusMap: { [key: string]: string } = {
            'Pending': 'pending',
            'Picked': 'picked',
            'In Transit': 'in_transit',
            'Delivered': 'delivered',
            'RTO': 'failed',
            'DTO': 'failed',
            'Lost': 'failed',
          };

          order.trackingStatus = statusMap[shipment.status] || 'pending';
          order.status = order.trackingStatus === 'delivered' ? 'delivered' : 'shipped';
          await order.save();
        }
        break;

      case 'update':
        const { paymentMode, codAmount } = await request.json();
        const updateData: any = {
          waybill: trackingWaybill,
        };

        if (paymentMode) {
          updateData.paymentMode = paymentMode;
          if (paymentMode === 'COD' && codAmount) {
            updateData.codAmount = codAmount;
          }
        }

        result = await delhiveryService.updateShipment(updateData);
        if (result.success) {
          if (paymentMode) {
            order.payment.mode = paymentMode;
          }
          await order.save();
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${action} completed successfully`,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingStatus: order.trackingStatus,
        trackingNumber: order.trackingNumber,
      },
      delhiveryResult: result,
    });
  } catch (error: any) {
    console.error('Delhivery action error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform action' },
      { status: 500 }
    );
  }
}
