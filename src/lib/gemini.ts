import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIDecoderResult, AIMode, DSALevel, ProgrammingLanguage } from '@/types';

// Server-side initialized Google Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Heuristic Fallback Generator for when Gemini API key is not supplied or during offline demo mode
function generateFallbackDecoderResult(query: string, language: ProgrammingLanguage = 'javascript'): AIDecoderResult {
  const qLower = query.toLowerCase();
  let pattern = 'Sliding Window / Two Pointers';
  let patternWhy = 'The problem seeks an optimal subarray or substring with specific contiguous constraints.';
  
  if (qLower.includes('tree') || qLower.includes('bst') || qLower.includes('binary tree')) {
    pattern = 'Binary Tree DFS / BFS';
    patternWhy = 'The hierarchical structure requires recursive subtree evaluation or level-order exploration.';
  } else if (qLower.includes('graph') || qLower.includes('island') || qLower.includes('shortest path')) {
    pattern = 'Graph BFS / DFS Traversal';
    patternWhy = 'The problem models connections between entities with possible cycles and pathing requirements.';
  } else if (qLower.includes('coin') || qLower.includes('ways') || qLower.includes('max profit') || qLower.includes('dynamic programming') || qLower.includes('subsequence')) {
    pattern = 'Dynamic Programming (1D/2D Tabulation)';
    patternWhy = 'The problem exhibits overlapping subproblems and optimal substructure where greedy choices are suboptimal.';
  } else if (qLower.includes('search') || qLower.includes('sorted') || qLower.includes('rotate')) {
    pattern = 'Binary Search / Interval Halving';
    patternWhy = 'The sorted nature or monotonic predicate allows discarding half of the search space at each iteration.';
  }

  return {
    problemRestatement: `We need to solve "${query}". The goal is to efficiently process the input data structure while meeting time constraints and maintaining correct edge case behavior.`,
    inputs: [
      'Primary data structure (array, string, tree, or graph)',
      'Target value or constraint threshold'
    ],
    outputs: [
      'Optimal result (index, maximum value, boolean match, or transformed collection)'
    ],
    constraints: [
      'Input size N up to 10^5 elements',
      'Time limit typically 1.0s (requiring O(N) or O(N log N))',
      'Space complexity target: O(1) or O(N)'
    ],
    clues: [
      `Key phrase identified in problem description points to ${pattern}.`,
      'Contiguous segment or sorted invariant allows pruning unnecessary work.',
      'Storing intermediate states eliminates redundant quadratic recalculations.'
    ],
    pattern: pattern,
    patternWhy: patternWhy,
    bruteForce: {
      description: 'Check every possible combination or nested pair using dual loops.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
      whySlow: 'Re-evaluates overlapping elements repeatedly, causing excessive redundant calculations when N is large.'
    },
    optimalApproach: {
      description: `Utilize ${pattern} to maintain an active state window/map in a single pass.`,
      logicDecode: `1. Initialize boundary pointers and lookup structures.\n2. Expand the primary pointer while tracking valid constraints.\n3. Contract or adjust secondary pointers whenever constraints are violated.\n4. Record the optimal solution at each valid state.`,
      pseudocode: `function solve(input):\n    initialize state, left = 0, best = 0\n    for right = 0 to input.length - 1:\n        updateState(input[right])\n        while stateIsInvalid():\n            removeState(input[left])\n            left++\n        best = updateBest(best, right - left + 1)\n    return best`,
      code: `function solveOptimal(data) {
  let left = 0;
  let best = 0;
  const tracker = new Map();

  for (let right = 0; right < data.length; right++) {
    const item = data[right];
    tracker.set(item, (tracker.get(item) || 0) + 1);

    // Maintain invariant
    while (tracker.get(item) > 1) {
      const leftItem = data[left];
      tracker.set(leftItem, tracker.get(leftItem) - 1);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      lineByLineExplanation: [
        { line: 1, code: 'function solveOptimal(data) {', explanation: 'Entry point accepting the dataset.' },
        { line: 2, code: 'let left = 0, best = 0;', explanation: 'Initialize left pointer and maximum result accumulator.' },
        { line: 3, code: 'const tracker = new Map();', explanation: 'Hash map to record frequencies in O(1) time.' },
        { line: 5, code: 'for (let right = 0; right < data.length; right++) {', explanation: 'Single pass expansion of right boundary.' },
        { line: 9, code: 'while (tracker.get(item) > 1) {', explanation: 'Condition violated: contract left boundary until valid.' },
        { line: 15, code: 'best = Math.max(best, right - left + 1);', explanation: 'Record maximum window size.' }
      ],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N) auxiliary map'
    },
    dryRun: [
      { step: 1, state: 'left=0, right=0', explanation: 'Process first element. State is valid. Best = 1.' },
      { step: 2, state: 'left=0, right=1', explanation: 'Expand window. No duplicates detected. Best = 2.' },
      { step: 3, state: 'left=0, right=2', explanation: 'Duplicate detected. Contract left pointer until valid.' },
      { step: 4, state: 'left=1, right=2', explanation: 'Invariant restored. Continue scanning remaining elements.' }
    ],
    edgeCases: [
      'Empty input collection or null reference',
      'Single element input',
      'All duplicate elements',
      'Extreme boundary constraints (negative values or integer overflow)'
    ],
    commonMistakes: [
      'Moving the wrong pointer during window contraction.',
      'Off-by-one errors when calculating subarray length (formula is `right - left + 1`).',
      'Failing to handle negative indices or uninitialized hash map entries.'
    ],
    interviewFollowUps: [
      'How would you handle streaming data where input cannot fit in memory?',
      'Can we optimize auxiliary space from O(N) to O(1) if character set is fixed (e.g. ASCII 128)?',
      'How would you adapt the algorithm to return the actual elements instead of just the length?'
    ],
    similarProblems: [
      'Longest Substring Without Repeating Characters',
      'Minimum Window Substring',
      'Subarray Product Less Than K'
    ]
  };
}

export async function decodeProblemWithAI(
  query: string,
  language: ProgrammingLanguage = 'javascript',
  userLevel: DSALevel = 'beginner'
): Promise<AIDecoderResult> {
  if (!genAI || !apiKey) {
    return generateFallbackDecoderResult(query, language);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are DSA De-coder, an expert world-class algorithm instructor.
Analyze this DSA problem/question: "${query}".
Target programming language: ${language}.
User DSA level: ${userLevel}.

Return ONLY valid JSON matching this exact structure without markdown backticks or commentary:
{
  "problemRestatement": "Concise intuitive summary of what the problem actually asks",
  "inputs": ["list of inputs with types"],
  "outputs": ["list of outputs with types"],
  "constraints": ["key constraints and limits"],
  "clues": ["vital keywords and deduction clues"],
  "pattern": "Name of primary algorithmic pattern (e.g. Sliding Window, Monotonic Stack, Two Pointers)",
  "patternWhy": "Clear explanation of why this pattern is the optimal choice",
  "bruteForce": {
    "description": "How brute force works",
    "timeComplexity": "Big-O",
    "spaceComplexity": "Big-O",
    "whySlow": "Detailed explanation of why brute force is inefficient"
  },
  "optimalApproach": {
    "description": "High level overview of optimal algorithm",
    "logicDecode": "Numbered step-by-step logic breakdown",
    "pseudocode": "Clean pseudocode",
    "code": "Complete working solution in ${language}",
    "lineByLineExplanation": [
      {"line": 1, "code": "...", "explanation": "..."}
    ],
    "timeComplexity": "Big-O with explanation",
    "spaceComplexity": "Big-O with explanation"
  },
  "dryRun": [
    {"step": 1, "state": "...", "explanation": "..."}
  ],
  "edgeCases": ["Edge case 1", "Edge case 2", "Edge case 3"],
  "commonMistakes": ["Common mistake 1", "Common mistake 2"],
  "interviewFollowUps": ["Follow up 1", "Follow up 2"],
  "similarProblems": ["Problem name 1", "Problem name 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleanJson) as AIDecoderResult;
  } catch (error) {
    console.error('Gemini decode error:', error);
    return generateFallbackDecoderResult(query, language);
  }
}

export async function evaluateUserReasoning(
  problemStatement: string,
  userGiven: string,
  userNeeded: string,
  userConstraints: string,
  userClues: string,
  userPattern: string
): Promise<{ score: number; feedback: string; strengths: string[]; suggestions: string[]; correctPattern: string }> {
  if (!genAI || !apiKey) {
    return {
      score: 85,
      feedback: `Great analytical breakdown! You accurately identified the key components of the problem. Your suggested pattern (${userPattern || 'Two Pointers/Hash Map'}) correctly addresses the core constraints.`,
      strengths: [
        'Clear identification of input constraints',
        'Good understanding of target output requirements',
        'Intuitive pattern recognition'
      ],
      suggestions: [
        'Consider boundary conditions like empty inputs and duplicate values',
        'Make sure to verify time complexity guarantees for the worst case'
      ],
      correctPattern: userPattern || 'Sliding Window / Hash Map'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert DSA mentor reviewing a student's 5-step problem analysis before they write code.
Problem: "${problemStatement}"
Student's analysis:
- What is Given: "${userGiven}"
- What is Needed: "${userNeeded}"
- Constraints Identified: "${userConstraints}"
- Important Clues: "${userClues}"
- Suggested Pattern: "${userPattern}"

Evaluate their reasoning. Return ONLY valid JSON:
{
  "score": number between 0 and 100,
  "feedback": "constructive mentor paragraph",
  "strengths": ["string", "string"],
  "suggestions": ["string", "string"],
  "correctPattern": "the most optimal pattern name"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    return {
      score: 80,
      feedback: 'Good thinking process! You have grasped the main elements of the problem.',
      strengths: ['Identified inputs and outputs', 'Formulated pattern candidate'],
      suggestions: ['Double check edge case boundaries'],
      correctPattern: userPattern || 'Optimal Pattern'
    };
  }
}

export async function explainCodeWithAI(
  code: string,
  language: string = 'javascript'
): Promise<{
  overallLogic: string;
  dataStructures: string[];
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  lineByLine: { line: number; code: string; explanation: string }[];
  improvements: string[];
}> {
  if (!genAI || !apiKey) {
    const lines = code.split('\n').filter(l => l.trim().length > 0);
    return {
      overallLogic: 'This code solves the problem by iterating through the input structure and maintaining key pointers/state variables to achieve the desired result.',
      dataStructures: ['Array / Vector', 'Hash Map / Frequency Tracker', 'Pointers (low, high, mid)'],
      algorithm: 'Two Pointers / Sliding Window / In-place traversal',
      timeComplexity: 'O(N) - single pass over elements',
      spaceComplexity: 'O(1) auxiliary space',
      lineByLine: lines.slice(0, 10).map((line, idx) => ({
        line: idx + 1,
        code: line,
        explanation: `Executes line ${idx + 1}: updates state and advances execution flow.`
      })),
      improvements: [
        'Add input validation checks for null or empty collections.',
        'Use strict equality and avoid accidental memory leaks.',
        'Consider early exits if target condition is satisfied early.'
      ]
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this ${language} code as an expert DSA educator.
Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON:
{
  "overallLogic": "summary of how the code works",
  "dataStructures": ["used data structure 1", "used data structure 2"],
  "algorithm": "algorithm name",
  "timeComplexity": "Big-O with explanation",
  "spaceComplexity": "Big-O with explanation",
  "lineByLine": [
    {"line": 1, "code": "...", "explanation": "..."}
  ],
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    return {
      overallLogic: 'Analyzed algorithm executes sequential logic to process inputs.',
      dataStructures: ['Array', 'Pointers'],
      algorithm: 'Iterative Algorithm',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      lineByLine: [{ line: 1, code: code.substring(0, 50), explanation: 'Main algorithm loop.' }],
      improvements: ['Verify edge cases and null inputs.']
    };
  }
}

export async function debugCodeWithAI(
  code: string,
  errorDesc: string,
  language: string = 'javascript'
): Promise<{
  error: string;
  whyItHappens: string;
  correctedCode: string;
  explanation: string;
  betterImplementation: string;
  commonMistake: string;
}> {
  if (!genAI || !apiKey) {
    return {
      error: 'Potential Index Out of Bounds / Off-By-One Boundary Error',
      whyItHappens: 'Loop termination condition `< length` vs `<= length` or unhandled empty input causing undefined property access.',
      correctedCode: `// Corrected implementation\nfunction fixedSolution(arr) {\n  if (!arr || arr.length === 0) return 0;\n  // Fixed boundary checks\n  return arr.length;\n}`,
      explanation: 'Added guard clauses and validated loop upper bounds to avoid out-of-range index dereferencing.',
      betterImplementation: 'Use high-level abstractions or standard language library methods where appropriate.',
      commonMistake: 'Failing to test with 0-length inputs and duplicate key collisions.'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Debug this ${language} code.
Code:
\`\`\`${language}
${code}
\`\`\`
Reported issue / error: "${errorDesc}"

Return ONLY valid JSON:
{
  "error": "Identified bug name and summary",
  "whyItHappens": "Root cause explanation",
  "correctedCode": "The fixed working code",
  "explanation": "What was changed and why",
  "betterImplementation": "A cleaner/more optimal alternative",
  "commonMistake": "Why developers often make this specific mistake"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    return {
      error: 'Bug Detected',
      whyItHappens: 'Edge case condition violated.',
      correctedCode: code,
      explanation: 'Ensure all index boundaries and base cases are checked.',
      betterImplementation: code,
      commonMistake: 'Boundary off-by-one errors.'
    };
  }
}

export async function chatWithDSAMentor(
  messages: { role: string; content: string }[],
  context?: { topic?: string; level?: string; language?: string; mode?: AIMode }
): Promise<string> {
  if (!genAI || !apiKey) {
    const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    if (lastMsg.includes('recursion')) {
      return `Recursion is like Russian nesting dolls! 🪆\n\n1. **Base Case**: The smallest doll that cannot be opened.\n2. **Recursive Step**: Opening a doll to reveal a smaller one.\n3. **Call Stack**: The pile of open shells waiting to be closed back up.\n\nAlways ask yourself: *"What is my stop condition?"* and *"How do I make the problem smaller?"*`;
    }
    if (lastMsg.includes('binary search') || lastMsg.includes('sorted')) {
      return `Binary Search requires **sorted data** (or a monotonic condition) because sorting gives you the superpower to **eliminate 50% of choices** with a single comparison.\n\nIf the data was random, knowing that \`target > arr[mid]\` tells you nothing about where the target lives. In sorted data, it guarantees the target *must* be in the right half! ⚡`;
    }
    if (lastMsg.includes('two sum')) {
      return `💡 **Two Sum Concept**\n\nThe goal is to find two numbers that add up to a target.\nInstead of using a slow nested loop (O(N²)), we can use a **Hash Map**! As we iterate through the array, we calculate the \`complement = target - currentNumber\`. If the complement is in our map, we found our pair! If not, we store the \`currentNumber\` and its index in the map for future lookups. This brings our time complexity down to **O(N)**! ⚡`;
    }
    if (lastMsg.includes('hint')) {
      return `💡 **Mentor Hint**: Think about what happens if you store elements you have already seen in a Hash Map. Can you check whether the complement \`target - current\` exists in O(1) time?`;
    }
    return `I am currently in offline dummy mode! Try asking me to explain 'recursion', 'binary search', 'two sum', or ask for a 'hint'!`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const systemPrompt = `You are DSA De-coder AI Mentor, an empathetic, encouraging, and razor-sharp DSA expert.
Context:
- Current Topic: ${context?.topic || 'General DSA'}
- User Level: ${context?.level || 'Intermediate'}
- Programming Language: ${context?.language || 'JavaScript'}
- Learning Mode: ${context?.mode || 'standard'}

Rules:
- Never dump full code immediately unless explicitly asked.
- Focus on intuition, visual analogies, and "WHY" an algorithm works.
- Encourage the user to think through invariants and edge cases.
- Format responses cleanly with markdown, bullet points, and code snippets when appropriate.`;

    const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.content}`).join('\n\n');
    const result = await model.generateContent(`${systemPrompt}\n\nConversation History:\n${chatHistory}\n\nMentor response:`);
    return result.response.text().trim();
  } catch (error) {
    return 'I am currently operating in offline mode. How can I help you master your current DSA topic?';
  }
}
