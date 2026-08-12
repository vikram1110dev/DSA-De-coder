import { NextRequest, NextResponse } from 'next/server';
import { evaluateUserReasoning } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemStatement, userGiven, userNeeded, userConstraints, userClues, userPattern } = body;

    const evaluation = await evaluateUserReasoning(
      problemStatement || '',
      userGiven || '',
      userNeeded || '',
      userConstraints || '',
      userClues || '',
      userPattern || ''
    );

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error('API /api/ai/eval-reasoning error:', error);
    return NextResponse.json({ error: 'Evaluation failed', details: error.message }, { status: 500 });
  }
}
