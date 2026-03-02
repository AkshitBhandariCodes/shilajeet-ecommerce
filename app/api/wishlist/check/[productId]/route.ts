import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

export async function GET(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ isInWishlist: false });
        }

        await connectDB();

        const wishlistItem = await Wishlist.findOne({
            userId: session.user.id,
            productId: params.productId,
        });

        return NextResponse.json({ isInWishlist: !!wishlistItem });
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return NextResponse.json({ isInWishlist: false });
    }
}