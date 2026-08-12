import { NextRequest, NextResponse } from 'next/server';
import { runJavaScriptCode, runOtherLanguageCode } from '@/lib/code-runner';
import { TestCase } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'javascript', functionName = 'twoSum', testCases = [] } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    let result;
    if (language === 'javascript') {
      result = runJavaScriptCode(code, functionName, testCases);
    } else {
      result = runOtherLanguageCode(language, code, testCases);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/practice/run error:', error);
    return NextResponse.json({ error: 'Execution failed', details: error.message }, { status: 500 });
  }
}
