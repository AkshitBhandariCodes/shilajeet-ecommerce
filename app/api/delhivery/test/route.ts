import { NextRequest, NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export async function POST(request: NextRequest) {
  try {
    const { testType = 'shipment', data } = await request.json();

    if (testType === 'shipment') {
      // Test shipment creation
      const shipmentData = data || {
        orderId: `TEST_${Date.now()}`,
        customerName: 'Test Customer',
        customerPhone: '9999999999',
        customerEmail: 'test@example.com',
        deliveryAddress: 'Test Address, Test Building',
        deliveryCity: 'Delhi',
        deliveryState: 'Delhi',
        deliveryPin: '110001',
        weight: 0.5,
        paymentMode: 'COD',
        codAmount: 100,
        productsDesc: 'Test Product',
        quantity: '1',
      };

      console.log('Testing Delhivery shipment creation with:', shipmentData);

      const result = await delhiveryService.createShipment(shipmentData);
      
      return NextResponse.json({
        success: true,
        testType: 'shipment',
        result,
      });
    }

    if (testType === 'tat') {
      // Test TAT fetch
      const originPin = data?.originPin || '110035';
      const destinationPin = data?.destinationPin || '110001';

      console.log(`Testing TAT fetch from ${originPin} to ${destinationPin}`);

      const result = await delhiveryService.getExpectedTAT(originPin, destinationPin, 'S');
      
      return NextResponse.json({
        success: true,
        testType: 'tat',
        result,
      });
    }

    if (testType === 'pincode') {
      // Test pincode serviceability
      const pincode = data?.pincode || '110001';

      console.log(`Testing pincode serviceability for ${pincode}`);

      const result = await delhiveryService.checkPincodeServiceability(pincode);
      
      return NextResponse.json({
        success: true,
        testType: 'pincode',
        result,
      });
    }

    return NextResponse.json(
      { error: 'Invalid test type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Delhivery test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.data || error.toString(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testType = searchParams.get('type') || 'shipment';

    if (testType === 'config') {
      // Return config info (without sensitive data)
      return NextResponse.json({
        success: true,
        config: {
          baseUrl: process.env.DELHIVERY_ENVIRONMENT === 'production'
            ? 'https://track.delhivery.com'
            : 'https://staging-express.delhivery.com',
          environment: process.env.DELHIVERY_ENVIRONMENT,
          warehouseName: process.env.DELHIVERY_WAREHOUSE_NAME,
          warehousePin: process.env.DELHIVERY_WAREHOUSE_PIN,
          warehouseCity: process.env.DELHIVERY_WAREHOUSE_CITY,
          sellerName: process.env.SELLER_NAME,
          hasApiToken: !!process.env.DELHIVERY_API_TOKEN,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid test type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Delhivery config error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
