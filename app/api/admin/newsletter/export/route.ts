import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
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

        // Get all subscribers matching the query
        const subscribers = await Newsletter.find(query)
            .sort({ subscribedAt: -1 })
            .select('-metadata -__v');

        // Convert to CSV
        const csvHeaders = [
            'Email',
            'Name',
            'Status',
            'Source',
            'Subscribed Date',
            'Unsubscribed Date',
            'Product Updates',
            'Promotions',
            'Health Tips',
            'Weekly Newsletter',
            'Tags'
        ];

        const csvRows = subscribers.map(subscriber => [
            subscriber.email,
            subscriber.name || '',
            subscriber.status,
            subscriber.source,
            new Date(subscriber.subscribedAt).toISOString().split('T')[0],
            subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt).toISOString().split('T')[0] : '',
            subscriber.preferences.productUpdates ? 'Yes' : 'No',
            subscriber.preferences.promotions ? 'Yes' : 'No',
            subscriber.preferences.healthTips ? 'Yes' : 'No',
            subscriber.preferences.weeklyNewsletter ? 'Yes' : 'No',
            subscriber.tags.join('; ')
        ]);

        // Create CSV content
        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        // Return CSV file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error('Error exporting newsletter subscribers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}