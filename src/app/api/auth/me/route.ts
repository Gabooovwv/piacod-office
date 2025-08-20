import { NextRequest, NextResponse } from 'next/server';
import API_CONFIG from '@/lib/api-config';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        console.log('DEBUG: Received token cookie:', token);

        if (!token) {
            console.log('DEBUG: No token provided');
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        // Forward request to backend
        const backendResponse = await fetch(`${API_CONFIG.backendUrl}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'Internal server error1' },
            { status: 500 }
        );
    }
} 