import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import HeroSettings from '@/models/HeroSettings';

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

    await dbConnect();
    let settings = await HeroSettings.findOne();
    
    if (!settings) {
      settings = await HeroSettings.create({
        backgroundImage: {
          url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg',
          publicId: 'agnishila/bg/vd',
        },
        foregroundImages: [
          {
            url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png',
            title: 'Shilajit ShilaBoost Gummies',
            subtitle: '',
            order: 0,
          },
          {
            url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090443/agnishila/out12/3.png',
            title: 'KSM-66 AshwaGlow Gummies',
            subtitle: '',
            order: 1,
          },
        ],
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    let settings = await HeroSettings.findOne();
    if (!settings) {
      settings = new HeroSettings();
    }

    if (body.backgroundImage) {
      settings.backgroundImage = body.backgroundImage;
    }

    if (body.foregroundImages) {
      settings.foregroundImages = body.foregroundImages;
    }

    if (body.autoPlayInterval) {
      settings.autoPlayInterval = body.autoPlayInterval;
    }

    if (body.isActive !== undefined) {
      settings.isActive = body.isActive;
    }

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
