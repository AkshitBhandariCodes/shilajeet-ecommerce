import { NextRequest, NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const waybill = searchParams.get('waybill');
    const orderId = searchParams.get('orderId');

    if (!waybill && !orderId) {
      return NextResponse.json(
        { error: 'Waybill or Order ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // If orderId is provided, get the waybill from the order
    let trackingWaybill: string = waybill || '';
    if (orderId && !waybill) {
      const order = await Order.findOne({ orderNumber: orderId });
      if (!order || !order.trackingNumber) {
        return NextResponse.json(
          { error: 'Order not found or no tracking number available' },
          { status: 404 }
        );
      }
      trackingWaybill = order.trackingNumber;
    }

    // Fetch tracking from Shiprocket
    const trackingResult = await shiprocketService.trackShipment(trackingWaybill);

    if (!trackingResult.success) {
      return NextResponse.json(
        { error: 'Failed to fetch tracking information' },
        { status: 500 }
      );
    }

    // Parse Delhivery response
    const shipmentData = trackingResult.data;
    
    // Update order tracking status if orderId is provided
    if (orderId && shipmentData && shipmentData.length > 0) {
      const latestShipment = shipmentData[0];
      const statusMap: { [key: string]: string } = {
        'Pending': 'pending',
        'Picked': 'picked',
        'In Transit': 'in_transit',
        'Delivered': 'delivered',
        'RTO': 'failed',
        'DTO': 'failed',
        'Lost': 'failed',
      };

      const trackingStatus = statusMap[latestShipment.status] || 'pending';
      const orderStatus = trackingStatus === 'delivered' ? 'delivered' : 'shipped';

      await Order.findOneAndUpdate(
        { orderNumber: orderId },
        {
          trackingStatus,
          status: orderStatus,
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: shipmentData,
      waybill: trackingWaybill,
    });
  } catch (error: any) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}
