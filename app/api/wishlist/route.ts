import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

// GET - Fetch user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const wishlistItems = await Wishlist.find({ userId: session.user.id })
            .sort({ addedAt: -1 });

        return NextResponse.json(wishlistItems);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, productName, productPrice, productImage } = await request.json();

        if (!productId || !productName || !productPrice || !productImage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Check if item already exists in wishlist
        const existingItem = await Wishlist.findOne({
            userId: session.user.id,
            productId,
        });

        if (existingItem) {
            return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 });
        }

        const wishlistItem = new Wishlist({
            userId: session.user.id,
            productId,
            productName,
            productPrice,
            productImage,
        });

        await wishlistItem.save();

        return NextResponse.json({ message: 'Item added to wishlist', item: wishlistItem }, { status: 201 });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await connectDB();

        const deletedItem = await Wishlist.findOneAndDelete({
            userId: session.user.id,
            productId,
        });

        if (!deletedItem) {
            return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}