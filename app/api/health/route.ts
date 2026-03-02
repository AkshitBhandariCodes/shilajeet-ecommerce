import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();
        
        const dbStatus = {
            status: 'connected',
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json({
            database: dbStatus,
            message: 'Database connection is healthy'
        });
    } catch (error) {
        return NextResponse.json({
            database: {
                status: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            message: 'Database connection failed'
        }, { status: 500 });
    }
}