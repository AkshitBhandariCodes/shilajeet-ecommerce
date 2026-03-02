import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await request.json();

    // Validation
    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be less than 100 characters' },
        { status: 400 }
      );
    }

    if (comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      userId: session.user.id,
      productId: productId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Check if user has purchased this product (for verified reviews)
    const hasPurchased = await Order.findOne({
      userId: session.user.id,
      'items.productId': productId,
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });

    // Create review
    const review = new Review({
      productId,
      userId: session.user.id,
      userName: session.user.name,
      rating,
      title,
      comment,
      verified: !!hasPurchased,
    });

    await review.save();

    return NextResponse.json({
      success: true,
      review: {
        _id: review._id,
        productId: review.productId,
        userName: review.userName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        verified: review.verified,
        createdAt: review.createdAt,
      },
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}