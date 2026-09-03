export interface MentorRequestParams {
  exerciseTitle: string;
  instructions: string;
  concept: string;
  userCode: string;
  stdout?: string;
  stderr?: string;
  question: string;
  chatHistory?: { sender: 'user' | 'ai'; text: string }[];
}

export class GeminiMentorEngine {
  public static async askMentor(params: MentorRequestParams): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const responseText = await this.callGeminiAPI(apiKey, params);
        if (responseText) return responseText;
      } catch (err: any) {
        console.error('[GeminiMentorEngine] Gemini API call error:', err.message);
      }
    }

    // Fallback Socratic mentor response generator if API key missing or network fails
    return this.generateFallbackResponse(params);
  }

  private static async callGeminiAPI(apiKey: string, params: MentorRequestParams): Promise<string | null> {
    const systemPrompt = `You are CodeForge AI Mentor, an expert Socratic Go (Golang) programming tutor.
Your mission is to help students learn Go deeply by guiding them through code exercises.

RULES:
1. Be encouraging, concise, and clear.
2. Explain compiler errors or test failures in plain English.
3. Use Socratic questioning to guide the student toward fixing their code.
4. DO NOT dump the full complete solution code unless the user explicitly demands "give me the solution".
5. Use markdown formatting with code snippets when demonstrating syntax patterns.`;

    const contextPrompt = `EXERCISE: ${params.exerciseTitle} (${params.concept})
INSTRUCTIONS: ${params.instructions}

STUDENT'S CURRENT CODE:
\`\`\`go
${params.userCode}
\`\`\`

LAST ATTEMPT OUTPUT:
STDOUT: ${params.stdout || '(None)'}
STDERR: ${params.stderr || '(None)'}

STUDENT QUESTION: "${params.question}"`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${contextPrompt}` }],
      },
    ];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      // Try fallback to gemini-1.5-flash if 2.5 is not yet available in region
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const resFallback = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });
      if (resFallback.ok) {
        const data = await resFallback.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  private static generateFallbackResponse(params: MentorRequestParams): string {
    const q = params.question.toLowerCase();
    const stderr = (params.stderr || '').toLowerCase();

    if (q.includes('error') || stderr.length > 0) {
      if (stderr.includes('undefined')) {
        return `It looks like Go can't find a variable or function in your code!\n\n💡 **Tip**: Check if you misspelled the identifier or forgot to declare it with \`:=\` or \`var\`. In Go, all variables must be declared before use.`;
      }
      if (stderr.includes('expected')) {
        return `Notice the syntax error in your Go code!\n\n💡 **Tip**: Go requires strict syntax around parentheses \`()\`, braces \`{}\`, and package imports. Take a look at the line highlighted in your editor.`;
      }
      return `Let's break down what happened in your execution attempt:\n\nGo reported an issue during compilation. Check the line numbers in your console or try clicking line numbers in the Monaco editor to see line explanations!`;
    }

    if (q.includes('hint') || q.includes('help')) {
      return `Here is a Socratic hint for **${params.exerciseTitle}**:\n\nThink about what the exercise concept (\`${params.concept}\`) requires. Review how Go handles variables and types, and verify that your function returns or prints the expected result.`;
    }

    if (q.includes('concept') || q.includes('explain')) {
      return `The concept here is **${params.concept}**.\n\nIn Go, this dictates how data or control flow is managed. Try modifying your code and clicking **Run** to see how the output changes!`;
    }

    return `Great question! Looking at your code attempt for **${params.exerciseTitle}**, you're on the right track with **${params.concept}**. Modify your solution based on the instructions and hit **Run** to test your logic!`;
  }
}
