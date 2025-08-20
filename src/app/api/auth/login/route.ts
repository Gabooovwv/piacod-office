import { NextRequest, NextResponse } from 'next/server';
import API_CONFIG from '@/lib/api-config';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const backendResponse = await fetch(`${API_CONFIG.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        const response = NextResponse.json(data);

        // Set HTTP-only cookie with JWT token from backend
        if (data.token) {
            response.cookies.set('token', data.token, {
                httpOnly: true,
                secure: false, // Always false in dev for local testing
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 // 24 hours
            });
        }

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 