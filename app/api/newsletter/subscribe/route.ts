import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: NextRequest) {
    try {
        const { email, name, preferences } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
        }

        await connectDB();

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return NextResponse.json({ 
                    error: 'This email is already subscribed to our newsletter' 
                }, { status: 409 });
            } else {
                // Reactivate if previously unsubscribed
                existingSubscriber.status = 'active';
                existingSubscriber.subscribedAt = new Date();
                existingSubscriber.unsubscribedAt = undefined;
                if (name) existingSubscriber.name = name;
                if (preferences) existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
                
                await existingSubscriber.save();
                
                return NextResponse.json({ 
                    message: 'Successfully resubscribed to newsletter!',
                    subscriber: {
                        email: existingSubscriber.email,
                        name: existingSubscriber.name,
                        status: existingSubscriber.status
                    }
                }, { status: 200 });
            }
        }

        // Get request metadata
        const metadata = {
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            referrer: request.headers.get('referer') || 'direct',
        };

        // Create new subscriber
        const newSubscriber = new Newsletter({
            email: email.toLowerCase(),
            name: name || '',
            preferences: preferences || {
                productUpdates: true,
                promotions: true,
                healthTips: true,
                weeklyNewsletter: true,
            },
            metadata,
            source: 'website',
        });

        await newSubscriber.save();

        return NextResponse.json({ 
            message: 'Successfully subscribed to newsletter!',
            subscriber: {
                email: newSubscriber.email,
                name: newSubscriber.name,
                status: newSubscriber.status
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        if (error instanceof Error && error.message.includes('duplicate key')) {
            return NextResponse.json({ 
                error: 'This email is already subscribed to our newsletter' 
            }, { status: 409 });
        }

        return NextResponse.json({ 
            error: 'Failed to subscribe to newsletter. Please try again.' 
        }, { status: 500 });
    }
}