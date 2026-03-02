import { NextRequest, NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const waybill = searchParams.get('waybill');
    const orderId = searchParams.get('orderId');

    if (!waybill) {
      return NextResponse.json({ error: 'Waybill is required' }, { status: 400 });
    }

    const result = await shiprocketService.trackShipment(waybill);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({
      error: error.message || 'Failed to track shipment'
    }, { status: 500 });
  }
}
