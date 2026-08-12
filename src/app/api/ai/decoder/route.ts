import { NextRequest, NextResponse } from 'next/server';
import { decodeProblemWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = 'javascript', userLevel = 'beginner' } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 });
    }

    const result = await decodeProblemWithAI(query, language, userLevel);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/decoder error:', error);
    return NextResponse.json({ error: 'Failed to decode problem', details: error.message }, { status: 500 });
  }
}
