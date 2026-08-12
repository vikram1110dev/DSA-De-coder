import { NextRequest, NextResponse } from 'next/server';
import { debugCodeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, errorDescription = '', language = 'javascript' } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    const result = await debugCodeWithAI(code, errorDescription, language);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/debugger error:', error);
    return NextResponse.json({ error: 'Debugging failed', details: error.message }, { status: 500 });
  }
}
