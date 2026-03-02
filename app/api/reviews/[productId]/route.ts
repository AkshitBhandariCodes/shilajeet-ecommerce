import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const reviews = await Review.find({ 
      productId: params.productId,
      reported: false 
    })
    .sort({ createdAt: -1 })
    .select('-userId -__v')
    .limit(50); // Limit to 50 most recent reviews

    return NextResponse.json(reviews);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}