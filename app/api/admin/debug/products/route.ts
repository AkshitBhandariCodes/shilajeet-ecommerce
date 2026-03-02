import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const products = await Product.find({}).select('id name _id').limit(20);

    return NextResponse.json({
      count: products.length,
      products: products.map(p => ({
        _id: p._id,
        id: p.id,
        name: p.name,
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    );
  }
}
