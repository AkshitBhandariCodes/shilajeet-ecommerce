import { NextRequest, NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export async function GET(
  request: NextRequest,
  { params }: { params: { waybill: string } }
) {
  try {
    if (!params.waybill) {
      return NextResponse.json({ error: 'Waybill is required' }, { status: 400 });
    }

    const tracking = await delhiveryService.trackShipment(params.waybill);
    return NextResponse.json(tracking);
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({ error: 'Failed to track shipment' }, { status: 500 });
  }
}
