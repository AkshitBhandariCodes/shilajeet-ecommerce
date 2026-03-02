import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CarouselHero from '@/models/CarouselHero';

export const dynamic = 'force-dynamic';

async function checkAdmin(session: any) {
  if (!session?.user?.id) return false;
  await dbConnect();
  const user = await User.findById(session.user.id);
  return user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    let carousel = await CarouselHero.findOne();
    
    if (!carousel) {
      console.log('No carousel found, creating default...');
      carousel = await CarouselHero.create({
        slides: [
          {
            url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png',
            title: 'Premium Shilajit',
            subtitle: 'Pure Himalayan Shilajit',
            ctaText: 'Shop Now',
            ctaLink: '/products',
            imageLink: '/products',
            order: 0,
          },
          {
            url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090443/agnishila/out12/3.png',
            title: 'Ashwagandha Gummies',
            subtitle: 'Stress Relief & Wellness',
            ctaText: 'Explore',
            ctaLink: '/products',
            imageLink: '/products',
            order: 1,
          },
        ],
        autoPlayInterval: 4000,
        isActive: true,
      });
    }

    // Ensure isActive is true and slides exist
    if (!carousel.isActive) {
      carousel.isActive = true;
      await carousel.save();
    }

    if (!carousel.slides || carousel.slides.length === 0) {
      carousel.slides = [
        {
          url: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090441/agnishila/out12/2.png',
          title: 'Premium Shilajit',
          subtitle: 'Pure Himalayan Shilajit',
          ctaText: 'Shop Now',
          ctaLink: '/products',
          imageLink: '/products',
          order: 0,
        },
      ];
      await carousel.save();
    }

    console.log('Carousel data:', {
      isActive: carousel.isActive,
      slidesCount: carousel.slides?.length || 0,
      autoPlayInterval: carousel.autoPlayInterval,
    });

    return NextResponse.json(carousel);
  } catch (error) {
    console.error('Error fetching carousel hero:', error);
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

    let carousel = await CarouselHero.findOne();
    if (!carousel) {
      carousel = new CarouselHero();
    }

    if (body.slides) {
      carousel.slides = body.slides;
    }

    if (body.autoPlayInterval) {
      carousel.autoPlayInterval = body.autoPlayInterval;
    }

    if (body.isActive !== undefined) {
      carousel.isActive = body.isActive;
    }

    await carousel.save();
    return NextResponse.json(carousel);
  } catch (error) {
    console.error('Error updating carousel hero:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
