import { NextResponse } from 'next/server';

export async function GET() {
    // Check if any provider has a server-side API key configured
    const hasServerKey = !!(
        process.env.OPENAI_API_KEY ||
        process.env.OPENROUTER_API_KEY ||
        process.env.GROQ_API_KEY ||
        process.env.TOGETHER_API_KEY ||
        process.env.FIREWORKS_API_KEY
    );

    // Report which providers have server keys (without exposing the keys)
    const serverProviders: string[] = [];
    if (process.env.OPENAI_API_KEY) serverProviders.push('openai');
    if (process.env.OPENROUTER_API_KEY) serverProviders.push('openrouter');
    if (process.env.GROQ_API_KEY) serverProviders.push('groq');
    if (process.env.TOGETHER_API_KEY) serverProviders.push('together');
    if (process.env.FIREWORKS_API_KEY) serverProviders.push('fireworks');

    return NextResponse.json({ hasServerKey, serverProviders });
}
