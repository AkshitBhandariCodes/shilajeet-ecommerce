import { NextRequest, NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const billingMode = searchParams.get('billingMode') as 'E' | 'S';
    const chargeableWeight = parseInt(searchParams.get('chargeableWeight') || '0');
    const originPin = searchParams.get('originPin');
    const destinationPin = searchParams.get('destinationPin');
    const shipmentStatus = searchParams.get('shipmentStatus') as 'Delivered' | 'RTO' | 'DTO';
    const paymentType = searchParams.get('paymentType') as 'Pre-paid' | 'COD';

    if (!billingMode || !chargeableWeight || !originPin || !destinationPin || !shipmentStatus || !paymentType) {
      return NextResponse.json({ 
        error: 'Missing required parameters: billingMode, chargeableWeight, originPin, destinationPin, shipmentStatus, paymentType' 
      }, { status: 400 });
    }

    const result = await delhiveryService.calculateShippingCost({
      billingMode,
      chargeableWeight,
      originPin,
      destinationPin,
      shipmentStatus,
      paymentType,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error calculating shipping cost:', error);
    return NextResponse.json({
      error: error.message || 'Failed to calculate shipping cost'
    }, { status: 500 });
  }
}
