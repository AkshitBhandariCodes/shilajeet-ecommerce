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

    // Find order
    let order = await Order.findOne({
      orderNumber: params.orderId,
      userId: session.user.id
    });

    if (!order) {
      order = await Order.findOne({
        _id: params.orderId,
        userId: session.user.id
      });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch latest tracking data from Delhivery
    let trackingData = null;
    if (order.trackingNumber) {
      try {
        const result = await delhiveryService.trackShipment(order.trackingNumber, order.orderNumber);
        
        if (result.success && result.data) {
          trackingData = Array.isArray(result.data) ? result.data[0] : result.data;
          
          if (trackingData) {
            // Update order with latest info
            order.delhiveryData = {
              waybill: order.trackingNumber,
              currentStatus: trackingData.status,
              lastUpdate: new Date(),
              scans: trackingData.scans || [],
            };

            if (trackingData.scans && trackingData.scans.length > 0) {
              const lastScan = trackingData.scans[trackingData.scans.length - 1];
              order.shippingStats = {
                ...order.shippingStats,
                lastLocation: lastScan.location,
                attemptCount: trackingData.attempt_count || 0,
              };

              // Update status based on scans
              if (trackingData.status === 'Delivered') {
                order.status = 'delivered';
                order.trackingStatus = 'delivered';
                order.shippingStats.deliveredDate = new Date(lastScan.timestamp);
              } else if (trackingData.status === 'In Transit') {
                order.status = 'shipped';
                order.trackingStatus = 'in_transit';
                order.shippingStats.inTransitDate = new Date(lastScan.timestamp);
              }
            }

            await order.save();
          }
        }
      } catch (trackingError) {
        console.error('Error fetching tracking data:', trackingError);
      }
    }

    // Calculate stats
    const stats = {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMode: order.payment.mode,
      paymentStatus: order.payment.status,
      
      // Order details
      items: {
        count: order.items.length,
        total: order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      },
      
      // Pricing
      pricing: {
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        discount: order.discountAmount,
        total: order.total,
        couponCode: order.couponCode || null,
      },
      
      // Shipping
      shipping: {
        provider: order.shippingProvider,
        trackingNumber: order.trackingNumber,
        trackingStatus: order.trackingStatus,
        trackingUrl: order.delhiveryData?.trackingUrl || null,
      },
      
      // Delivery estimates
      delivery: {
        expectedDeliveryDate: order.delhiveryData?.expectedDeliveryDate || order.shippingStats?.estimatedDelivery,
        expectedDeliveryDays: order.delhiveryData?.expectedDeliveryDays || 5,
        lastLocation: order.shippingStats?.lastLocation || null,
        attemptCount: order.shippingStats?.attemptCount || 0,
      },
      
      // Timeline
      timeline: {
        orderCreated: order.createdAt,
        pickedDate: order.shippingStats?.pickedDate || null,
        inTransitDate: order.shippingStats?.inTransitDate || null,
        deliveredDate: order.shippingStats?.deliveredDate || null,
      },
      
      // Tracking scans
      trackingScans: order.delhiveryData?.scans || [],
      
      // Address
      shippingAddress: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: `${order.shippingAddress.address1}${order.shippingAddress.address2 ? ', ' + order.shippingAddress.address2 : ''}`,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
      },
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
