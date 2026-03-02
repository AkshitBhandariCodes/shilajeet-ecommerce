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

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Get order details
    const order = await Order.findOne({ orderNumber: orderId });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if shipment already created
    if (order.trackingNumber) {
      return NextResponse.json({
        success: true,
        waybill: order.trackingNumber,
        trackingUrl: `https://track.shiprocket.in/tracking/${order.trackingNumber}`,
        message: 'Shipment already created'
      });
    }

    // Prepare shipment data according to Shiprocket API spec
    const shipmentData = {
      orderId: order.orderNumber,
      customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      customerPhone: order.shippingAddress.phone,
      customerEmail: order.shippingAddress.email,
      deliveryAddress: `${order.shippingAddress.address1}${order.shippingAddress.address2 ? ', ' + order.shippingAddress.address2 : ''}`,
      deliveryCity: order.shippingAddress.city,
      deliveryState: order.shippingAddress.state,
      deliveryPin: order.shippingAddress.zipCode,
      
      // Weight in kg (default 0.5kg for wellness products)
      weight: 0.5,
      
      // Payment mode based on payment method
      paymentMode: (order.payment?.mode === 'COD' ? 'COD' : 'Prepaid') as 'COD' | 'Prepaid',
      
      // COD amount if applicable
      codAmount: order.payment?.mode === 'COD' ? order.total : 0,
      
      // Product information
      productsDesc: order.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', '),
      quantity: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0).toString(),
    };

    const result = await shiprocketService.createShipment(shipmentData);

    if (!result.success) {
      return NextResponse.json({
        error: result.message || 'Failed to create shipment'
      }, { status: 400 });
    }

    // Save waybill to order
    order.trackingNumber = result.waybill;
    order.shippingProvider = 'shiprocket';
    order.trackingStatus = 'pending';
    await order.save();

    return NextResponse.json({
      success: true,
      waybill: result.waybill,
      shipmentId: result.shipmentId,
      trackingUrl: result.trackingUrl,
      message: result.message || 'Shipment created successfully'
    });
  } catch (error: any) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({
      error: error.message || 'Failed to create shipment'
    }, { status: 500 });
  }
}
