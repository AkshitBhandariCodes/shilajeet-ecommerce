import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectDB();

        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

        if (!subscriber) {
            return NextResponse.json({ 
                error: 'Email not found in our newsletter list' 
            }, { status: 404 });
        }

        if (subscriber.status === 'unsubscribed') {
            return NextResponse.json({ 
                message: 'Email is already unsubscribed' 
            }, { status: 200 });
        }

        // Update subscriber status
        subscriber.status = 'unsubscribed';
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        return NextResponse.json({ 
            message: 'Successfully unsubscribed from newsletter' 
        }, { status: 200 });

    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        return NextResponse.json({ 
            error: 'Failed to unsubscribe. Please try again.' 
        }, { status: 500 });
    }
}