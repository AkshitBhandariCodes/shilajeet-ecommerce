import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

// GET - Fetch all newsletter subscribers (Admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Build query
        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count
        const total = await Newsletter.countDocuments(query);

        // Get subscribers with pagination
        const subscribers = await Newsletter.find(query)
            .sort({ subscribedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-metadata -__v');

        // Get statistics
        const stats = await Newsletter.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statistics = {
            total: await Newsletter.countDocuments(),
            active: stats.find(s => s._id === 'active')?.count || 0,
            unsubscribed: stats.find(s => s._id === 'unsubscribed')?.count || 0,
            bounced: stats.find(s => s._id === 'bounced')?.count || 0,
        };

        return NextResponse.json({
            subscribers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            statistics
        });

    } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Add subscriber manually (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, name, preferences, tags } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectDB();

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return NextResponse.json({ 
                error: 'Email already exists in newsletter list' 
            }, { status: 409 });
        }

        const newSubscriber = new Newsletter({
            email: email.toLowerCase(),
            name: name || '',
            preferences: preferences || {
                productUpdates: true,
                promotions: true,
                healthTips: true,
                weeklyNewsletter: true,
            },
            tags: tags || [],
            source: 'admin',
        });

        await newSubscriber.save();

        return NextResponse.json({ 
            message: 'Subscriber added successfully',
            subscriber: newSubscriber
        }, { status: 201 });

    } catch (error) {
        console.error('Error adding newsletter subscriber:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove subscriber (Admin only)
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const subscriberId = searchParams.get('id');

        if (!subscriberId) {
            return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
        }

        await connectDB();

        const deletedSubscriber = await Newsletter.findByIdAndDelete(subscriberId);

        if (!deletedSubscriber) {
            return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subscriber deleted successfully' });

    } catch (error) {
        console.error('Error deleting newsletter subscriber:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}