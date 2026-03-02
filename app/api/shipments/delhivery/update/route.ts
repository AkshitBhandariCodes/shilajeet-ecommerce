import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import delhiveryService from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { waybill, name, phone, paymentMode, codAmount, address, productsDesc, weight, shipmentHeight, shipmentWidth, shipmentLength } = await request.json();

    if (!waybill) {
      return NextResponse.json({ error: 'Waybill is required' }, { status: 400 });
    }

    await dbConnect();

    const result = await delhiveryService.updateShipment({
      waybill,
      name,
      phone,
      paymentMode,
      codAmount,
      address,
      productsDesc,
      weight,
      shipmentHeight,
      shipmentWidth,
      shipmentLength,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({
      error: error.message || 'Failed to update shipment'
    }, { status: 500 });
  }
}
