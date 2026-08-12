import { NextRequest, NextResponse } from 'next/server';
import { chatWithDSAMentor } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const reply = await chatWithDSAMentor(messages, context);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json({ error: 'Chat failed', details: error.message }, { status: 500 });
  }
}
