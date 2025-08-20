import { NextRequest, NextResponse } from 'next/server';
import API_CONFIG from '@/lib/api-config';

// GET - Get all products
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Forward request to backend
        const backendResponse = await fetch(`${API_CONFIG.backendUrl}/api/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new product (not implemented in backend yet)
export async function POST(request: NextRequest) {
    try {
        return NextResponse.json(
            { error: 'Create product not implemented yet' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 