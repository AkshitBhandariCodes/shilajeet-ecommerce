import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch products with 2 Raisins validation
    const products = await Product.find({
      twoRaisinsValidated: true
    }).select('id name twoRaisinsValidated batchNumber');

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching 2 raisins validated products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validated products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { productId, twoRaisinsValidated } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findOneAndUpdate(
      { id: productId },
      { twoRaisinsValidated },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product ${twoRaisinsValidated ? 'marked' : 'unmarked'} with 2 Raisins validation`,
      product
    });
  } catch (error) {
    console.error('Error updating 2 raisins validation:', error);
    return NextResponse.json(
      { error: 'Failed to update validation' },
      { status: 500 }
    );
  }
}
