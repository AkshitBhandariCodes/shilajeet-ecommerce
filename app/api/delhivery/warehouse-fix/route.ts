import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiToken = process.env.DELHIVERY_API_TOKEN;
    const baseUrl = process.env.DELHIVERY_ENVIRONMENT === 'production'
      ? 'https://track.delhivery.com'
      : 'https://staging-express.delhivery.com';

    // Update warehouse with complete configuration
    const payload = {
      name: 'Agnishila Warehouse',
      phone: '8448893545',
      address: 'Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area',
      pin: '110035',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      email: 'info@agnishila.in',
      return_address: 'Ground Floor, Pocket-O, N-261, Sector-1, Bawana Industrial Area',
      return_pin: '110035',
      return_city: 'Delhi',
      return_state: 'Delhi',
      return_country: 'India',
      return_phone: '8448893545',
    };

    console.log('Updating warehouse with payload:', payload);

    const response = await axios.post(
      `${baseUrl}/api/backend/clientwarehouse/edit/`,
      payload,
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Warehouse update response:', response.data);

    return NextResponse.json({
      success: true,
      message: 'Warehouse updated successfully',
      data: response.data,
    });
  } catch (error: any) {
    console.error('Warehouse update error:', error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Just return instructions
    return NextResponse.json({
      message: 'Use POST to update warehouse',
      instructions: 'POST /api/delhivery/warehouse-fix',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
