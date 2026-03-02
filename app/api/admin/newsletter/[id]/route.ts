import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

// PUT - Update subscriber (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, status, preferences, tags } = await request.json();

        await connectDB();

        const subscriber = await Newsletter.findById(params.id);

        if (!subscriber) {
            return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
        }

        // Update fields
        if (name !== undefined) subscriber.name = name;
        if (status !== undefined) {
            subscriber.status = status;
            if (status === 'unsubscribed' && subscriber.status !== 'unsubscribed') {
                subscriber.unsubscribedAt = new Date();
            } else if (status === 'active' && subscriber.status === 'unsubscribed') {
                subscriber.unsubscribedAt = undefined;
                subscriber.subscribedAt = new Date();
            }
        }
        if (preferences !== undefined) subscriber.preferences = { ...subscriber.preferences, ...preferences };
        if (tags !== undefined) subscriber.tags = tags;

        await subscriber.save();

        return NextResponse.json({ 
            message: 'Subscriber updated successfully',
            subscriber
        });

    } catch (error) {
        console.error('Error updating newsletter subscriber:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}