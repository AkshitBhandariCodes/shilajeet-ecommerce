import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const products = await Product.find({}, { id: 1, name: 1 }).lean();
    const productNameById = new Map<string, string>();

    products.forEach((product: any) => {
      if (product?.id) {
        productNameById.set(String(product.id), String(product.name));
      }
      if (product?._id) {
        productNameById.set(String(product._id), String(product.name));
      }
    });

    const reviews = await Review.find({ reported: false })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const formattedReviews = reviews.map((review: any) => ({
      _id: review._id,
      productId: String(review.productId || ''),
      productName: productNameById.get(String(review.productId)) || 'Unknown Product',
      customerName: review.userName || review.userId?.name || 'Anonymous',
      customerEmail: review.userId?.email || '',
      title: review.title || '',
      rating: review.rating,
      comment: review.comment,
      status: review.status || 'approved',
      createdAt: review.createdAt,
      helpful: review.helpful || 0
    }));

    return NextResponse.json(formattedReviews);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reviewId, status } = await request.json();

    if (!reviewId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
