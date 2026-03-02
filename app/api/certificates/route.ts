import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch products that have certificates
    const products = await Product.find({
      certificatePdfUrl: { $exists: true, $ne: null },
      batchNumber: { $exists: true, $ne: null }
    }).select('id name batchNumber certificatePdfUrl');

    // Format the response
    const certificates = products.map(product => ({
      productId: product.id,
      productName: product.name,
      batchNumber: product.batchNumber,
      certificatePdfUrl: product.certificatePdfUrl,
    }));

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
