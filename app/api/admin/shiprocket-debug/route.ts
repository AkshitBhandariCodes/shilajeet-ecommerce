import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import axios from 'axios';

export const dynamic = 'force-dynamic';

async function checkAdmin(session: any) {
  if (!session?.user?.id) return false;
  await dbConnect();
  const user = await User.findById(session.user.id);
  return user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = process.env.SHIPROCKET_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Shiprocket token not configured' }, { status: 400 });
    }

    // Try to get pickup locations
    try {
      const response = await axios.get(
        'https://apiv2.shiprocket.in/v1/external/settings/company/pickup-addresses',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return NextResponse.json({
        success: true,
        pickupLocations: response.data,
      });
    } catch (error: any) {
      console.error('Error fetching pickup locations:', error.response?.data || error.message);
      
      // Try alternative endpoint
      try {
        const altResponse = await axios.get(
          'https://apiv2.shiprocket.in/v1/external/settings/pickup-addresses',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return NextResponse.json({
          success: true,
          pickupLocations: altResponse.data,
        });
      } catch (altError: any) {
        return NextResponse.json({
          error: 'Failed to fetch pickup locations',
          details: error.response?.data || error.message,
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
