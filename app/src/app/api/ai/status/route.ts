import { NextResponse } from 'next/server';

export async function GET() {
    const hasServerKey = !!process.env.OPENAI_API_KEY;
    return NextResponse.json({ hasServerKey });
}
