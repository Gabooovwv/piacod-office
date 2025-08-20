export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        const [rows] = await connection.execute('SELECT * FROM classified WHERE user_id = 1 LIMIT 1000');
        console.log(rows);
        await connection.end();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('MySQL error:', error);
        return NextResponse.json({ error: 'Database error', details: String(error) }, { status: 500 });
    }
} 