import { NextRequest, NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'register') {
      const result = await delhiveryService.registerWarehouse();
      return NextResponse.json(result);
    }

    if (action === 'update') {
      const result = await delhiveryService.updateWarehouse();
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "register" or "update"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Warehouse operation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'register';

    if (action === 'register') {
      const result = await delhiveryService.registerWarehouse();
      return NextResponse.json(result);
    }

    if (action === 'update') {
      const result = await delhiveryService.updateWarehouse();
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "register" or "update"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Warehouse operation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
