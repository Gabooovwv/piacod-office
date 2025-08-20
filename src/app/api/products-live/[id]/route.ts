export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { is_active } = await request.json();
        if (typeof is_active !== 'number' && typeof is_active !== 'boolean') {
            return NextResponse.json({ error: 'Invalid is_active value' }, { status: 400 });
        }
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
        await connection.execute('UPDATE classified SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
        await connection.end();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('MySQL error:', error);
        return NextResponse.json({ error: 'Database error', details: String(error) }, { status: 500 });
    }
} 