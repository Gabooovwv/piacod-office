import { NextRequest, NextResponse } from 'next/server';
import API_CONFIG from '@/lib/api-config';

export async function POST(request: NextRequest) {
    try {
        // Forward request to backend
        const backendResponse = await fetch(`${API_CONFIG.backendUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await backendResponse.json();

        const response = NextResponse.json(data);

        // Clear the token cookie
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: false, // Always false in dev for local testing
            sameSite: 'strict',
            maxAge: 0
        });
        console.log('logout');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 