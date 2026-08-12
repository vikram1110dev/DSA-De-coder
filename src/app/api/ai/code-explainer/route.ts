import { NextRequest, NextResponse } from 'next/server';
import { explainCodeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'javascript' } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    const result = await explainCodeWithAI(code, language);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/code-explainer error:', error);
    return NextResponse.json({ error: 'Failed to explain code', details: error.message }, { status: 500 });
  }
}
