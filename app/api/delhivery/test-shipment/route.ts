import { NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🧪 Testing Delhivery Shipment Creation...');

    // Test shipment data
    const testShipmentData = {
      orderId: `TEST-${Date.now()}`,
      customerName: 'Test User',
      customerPhone: '+919876543210',
      customerEmail: 'test@example.com',
      deliveryAddress: '123 Test Street, Test City',
      deliveryCity: 'Delhi',
      deliveryState: 'Delhi',
      deliveryPin: '110001',
      weight: 0.5,
      paymentMode: 'Prepaid' as const,
      codAmount: 0,
      productsDesc: 'Test Product',
      quantity: '1',
      shippingMode: 'Surface' as const,
      transportSpeed: 'D' as const,
    };

    console.log('📦 Test Shipment Data:', testShipmentData);

    // Attempt to create shipment
    const result = await delhiveryService.createShipment(testShipmentData);

    console.log('✅ Shipment Creation Successful!');
    console.log('📋 Result:', result);

    return NextResponse.json({
      success: true,
      message: 'Delhivery shipment creation test successful!',
      testData: testShipmentData,
      result: result,
      status: '✅ WORKING',
      nextSteps: [
        'Warehouse is properly configured on Delhivery',
        'Working days are set correctly',
        'Shipments will be created automatically for orders',
        'You can now create real orders'
      ]
    });

  } catch (error: any) {
    console.error('❌ Shipment Creation Test Failed');
    console.error('Error:', error.message);

    // Check if it's the end_date error
    if (error.message.includes('end_date')) {
      return NextResponse.json({
        success: false,
        message: 'Delhivery shipment creation test failed',
        error: error.message,
        status: '❌ CONFIGURATION NEEDED',
        issue: 'Warehouse working days not configured on Delhivery',
        fixSteps: [
          '1. Go to https://one.delhivery.com',
          '2. Settings → Pickup Locations',
          '3. Edit "Agnishila Warehouse"',
          '4. Uncheck all working days, then check Monday-Saturday',
          '5. Select "Evening 14:00:00 - 18:00:00" pickup slot',
          '6. Save Changes',
          '7. Wait 15-20 minutes',
          '8. Run this test again'
        ],
        documentation: 'See DELHIVERY_FINAL_FIX_INSTRUCTIONS.md'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Delhivery shipment creation test failed',
      error: error.message,
      status: '❌ ERROR',
      troubleshooting: [
        'Check DELHIVERY_API_TOKEN in .env',
        'Verify warehouse name matches Delhivery registration',
        'Check Delhivery API is accessible',
        'Review server logs for detailed error'
      ]
    }, { status: 500 });
  }
}
