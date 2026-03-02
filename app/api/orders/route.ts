import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import FireCoins from '@/models/FireCoins';
import Coupon from '@/models/Coupon';
import shiprocketService from '@/lib/shiprocket';
import { calculateTotalFireCoins } from '@/lib/fireCoins';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let { items, address, payment, couponCode, redeemedCoins, idempotencyKey } = await request.json();

    if (!items || !address || !payment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check for duplicate order using idempotency key
    if (idempotencyKey) {
      const existingOrder = await Order.findOne({ 
        userId: session.user.id,
        idempotencyKey 
      });
      
      if (existingOrder) {
        return NextResponse.json({
          success: true,
          order: {
            orderNumber: existingOrder.orderNumber,
            total: existingOrder.total,
            status: existingOrder.status,
            estimatedDelivery: new Date(existingOrder.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
          }
        });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = 0; // No tax
    const shipping = 0; // Free shipping
    
    // Handle coupon if provided
    let discountAmount = 0;
    let appliedCoupon = null;
    let signupDiscountApplied = false;
    
    if (couponCode) {
      appliedCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      
      if (appliedCoupon) {
        // Check if coupon is still valid
        if (appliedCoupon.expiryDate && new Date(appliedCoupon.expiryDate) < new Date()) {
          return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }
        
        if (appliedCoupon.maxUses && appliedCoupon.usedBy.length >= appliedCoupon.maxUses) {
          return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }
        
        if (subtotal < appliedCoupon.minOrderAmount) {
          return NextResponse.json({ error: 'Minimum order amount not met' }, { status: 400 });
        }
        
        // Calculate discount
        if (appliedCoupon.discountType === 'percentage') {
          discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
          if (appliedCoupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
          }
        } else {
          discountAmount = appliedCoupon.discountValue;
        }
        
        // Check if this is a signup discount coupon
        if (appliedCoupon.code.startsWith('WELCOME5')) {
          signupDiscountApplied = true;
        }
      }
    } else {
      // Auto-apply signup discount if user hasn't used it yet
      const User = require('@/models/User').default;
      const user = await User.findById(session.user.id);
      
      if (user && !user.signupDiscountUsed && user.signupDiscountCode) {
        // Check if user's signup discount coupon exists and is valid
        const signupCoupon = await Coupon.findOne({ 
          code: user.signupDiscountCode, 
          active: true 
        });
        
        if (signupCoupon) {
          // Check if coupon is still valid
          if (!signupCoupon.expiryDate || new Date(signupCoupon.expiryDate) >= new Date()) {
            // Check if coupon hasn't been used yet
            if (!signupCoupon.usedBy || signupCoupon.usedBy.length === 0) {
              // Auto-apply the signup discount
              appliedCoupon = signupCoupon;
              couponCode = user.signupDiscountCode;
              
              // Calculate discount
              if (signupCoupon.discountType === 'percentage') {
                discountAmount = (subtotal * signupCoupon.discountValue) / 100;
                if (signupCoupon.maxDiscount) {
                  discountAmount = Math.min(discountAmount, signupCoupon.maxDiscount);
                }
              } else {
                discountAmount = signupCoupon.discountValue;
              }
              
              signupDiscountApplied = true;
            }
          }
        }
      }
    }
    
    // Handle coin redemption if provided
    let coinDiscount = 0;
    if (redeemedCoins && redeemedCoins > 0) {
      // Validate user has enough coins
      const userCoins = await FireCoins.findOne({ userId: session.user.email });
      if (!userCoins || userCoins.balance < redeemedCoins) {
        return NextResponse.json({ error: 'Insufficient fire coins balance' }, { status: 400 });
      }
      coinDiscount = redeemedCoins;
    }
    
    const finalTotal = Math.max(0, subtotal + tax + shipping - discountAmount - coinDiscount);

    // Determine payment mode and method
    const paymentMode = payment.mode || 'COD'; // Default to COD
    const isOnlinePayment = paymentMode === 'Prepaid';
    const isRazorpayPayment = isOnlinePayment && payment.razorpayData && payment.razorpayData.verified;
    
    // Validate online payment
    if (isOnlinePayment && !isRazorpayPayment) {
      return NextResponse.json(
        { error: 'Online payment verification failed' },
        { status: 400 }
      );
    }

    // Build payment info based on mode
    const paymentInfo = isOnlinePayment
      ? {
          mode: 'Prepaid',
          method: 'Razorpay',
          cardNumber: payment.razorpayData?.cardNumber ? '**** **** **** ' + payment.razorpayData.cardNumber.slice(-4) : undefined,
          cardholderName: payment.razorpayData?.userDetails?.name || 'Online Payment',
          transactionId: payment.razorpayData?.paymentId,
          status: 'completed',
        }
      : {
          mode: 'COD',
          method: undefined,
          cardNumber: undefined,
          cardholderName: undefined,
          transactionId: undefined,
          status: 'pending',
        };

    // Generate order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `AG${timestamp.slice(-6)}${random}`;

    // Create order
    const order = new Order({
      orderNumber,
      userId: session.user.id,
      idempotencyKey,
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant,
      })),
      shippingAddress: address,
      billingAddress: payment.billingAddress?.sameAsShipping ? address : payment.billingAddress,
      payment: paymentInfo,
      subtotal,
      tax,
      shipping,
      couponCode: couponCode || undefined,
      discountAmount: discountAmount + coinDiscount,
      total: finalTotal,
      status: 'confirmed',
    });

    await order.save();

    // Create Shiprocket shipment automatically
    let shipmentError: string | null = null;
    
    try {
      const shipmentData = {
        orderId: order.orderNumber,
        customerName: `${address.firstName} ${address.lastName}`,
        customerPhone: address.phone,
        customerEmail: address.email,
        deliveryAddress: `${address.address1}${address.address2 ? ', ' + address.address2 : ''}`,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryPin: address.zipCode,
        weight: 0.5, // 500 grams
        paymentMode: (paymentMode === 'Prepaid' ? 'Prepaid' : 'COD') as 'COD' | 'Prepaid',
        codAmount: paymentMode === 'COD' ? finalTotal : 0,
        productsDesc: items.map((item: any) => item.name).join(', '),
        quantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0).toString(),
        shippingMode: 'Surface' as 'Surface' | 'Express',
        transportSpeed: 'D' as 'D' | 'F',
      };

      console.log('Attempting to create Shiprocket shipment with data:', shipmentData);

      let shipmentResult: any = null;

      try {
        shipmentResult = await shiprocketService.createShipment(shipmentData);
        console.log('Shiprocket shipment result:', shipmentResult);
      } catch (error: any) {
        shipmentError = error.message;
        console.error('Shiprocket shipment creation failed:', shipmentError);
        // Continue with order creation even if Shiprocket fails
      }

      if (shipmentResult?.waybill) {
        order.trackingNumber = shipmentResult.waybill;
        order.shippingProvider = 'shiprocket';
        order.trackingStatus = 'pending';
        order.shiprocketData = {
          waybill: shipmentResult.waybill,
          shipmentId: shipmentResult.shipmentId,
          orderId: shipmentResult.orderId,
          trackingUrl: shipmentResult.trackingUrl,
        };

        // Set default delivery date
        const defaultDeliveryDate = new Date();
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 5);
        order.shippingStats = {
          estimatedDelivery: defaultDeliveryDate,
        };

        await order.save();
      } else {
        console.warn('No waybill returned from Shiprocket:', shipmentResult);
        // Set default delivery date even if no waybill
        const defaultDeliveryDate = new Date();
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 5);
        order.shippingStats = {
          estimatedDelivery: defaultDeliveryDate,
        };
        await order.save();
      }
    } catch (error) {
      console.error('Error creating Shiprocket shipment:', error);
      // Don't fail the order if shipment creation fails - just set default delivery date
      // This allows orders to be created even if Shiprocket API has issues
      const defaultDeliveryDate = new Date();
      defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 5);
      order.shippingStats = {
        estimatedDelivery: defaultDeliveryDate,
      };
      order.status = 'confirmed'; // Still mark as confirmed even if shipment creation fails
      await order.save();
      
      console.warn('Order created successfully but Shiprocket shipment creation failed. Order will need manual shipment creation.');
    }

    // Update coupon usage if applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(
        appliedCoupon._id,
        {
          $push: {
            usedBy: {
              userId: session.user.id,
              orderId: order._id.toString(),
              usedAt: new Date(),
            },
          },
        }
      );
      
      // Mark signup discount as used if it was applied
      if (signupDiscountApplied) {
        const User = require('@/models/User').default;
        await User.findByIdAndUpdate(
          session.user.id,
          { signupDiscountUsed: true }
        );
      }
    }

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { items: [] } }
    );

    // Award Fire Coins for the purchase
    try {
      const coinsToEarn = calculateTotalFireCoins(items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity
      })));

      if (coinsToEarn > 0) {
        let fireCoins = await FireCoins.findOne({ userId: session.user.email });
        
        if (!fireCoins) {
          fireCoins = new FireCoins({
            userId: session.user.email,
            balance: 0,
            transactions: []
          });
        }

        fireCoins.transactions.push({
          type: 'earned',
          amount: coinsToEarn,
          orderId: order.orderNumber,
          description: `Earned ${coinsToEarn} Fire Coins from order ${order.orderNumber}`,
          createdAt: new Date()
        });

        fireCoins.balance += coinsToEarn;
        await fireCoins.save();

      }
    } catch (coinError) {
      console.error('Error awarding Fire Coins:', coinError);
      // Don't fail the order if Fire Coins award fails
    }

    // Send order confirmation email (simulate)

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.shippingStats?.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        delhiveryData: order.delhiveryData,
        shippingStats: order.shippingStats,
      },
      ...(shipmentError && { shipmentError })
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('-payment.cardNumber -payment.transactionId'); // Exclude sensitive payment info

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}