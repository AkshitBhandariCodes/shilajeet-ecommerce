import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.waybill || !body.pickupDate) {
      return NextResponse.json(
        { error: 'Missing required fields: waybill, pickupDate' },
        { status: 400 }
      );
    }

    // TODO: Implement Delhivery pickup request API call
    // This would typically call the Delhivery API to request a pickup

    return NextResponse.json({
      success: true,
      message: 'Pickup request submitted successfully',
      data: body
    });
  } catch (error) {
    console.error('Error creating pickup request:', error);
    return NextResponse.json(
      { error: 'Failed to create pickup request' },
      { status: 500 }
    );
  }
}
