export interface MentorRequestParams {
  exerciseTitle: string;
  instructions: string;
  concept: string;
  userCode: string;
  stdout?: string;
  stderr?: string;
  question: string;
  chatHistory?: { sender: 'user' | 'ai'; text: string }[];
  languageId?: string;
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
    const isPython = params.languageId === 'python';
    const langName = isPython ? 'Python' : 'Go (Golang)';
    const codeFence = isPython ? 'python' : 'go';

    const systemPrompt = `You are CodeForge AI Mentor, an expert Socratic ${ langName } programming tutor.
      Your mission is to help students learn ${ langName } deeply by guiding them through code exercises.

      RULES:
        1. Be encouraging, concise, and clear.
2. Explain errors or test failures in plain English.
3. Use Socratic questioning to guide the student toward fixing their code.
4. DO NOT dump the full complete solution code unless the user explicitly demands "give me the solution".
5. Use markdown formatting with code snippets when demonstrating syntax patterns.`;

    const contextPrompt = `EXERCISE: ${ params.exerciseTitle } (${ params.concept })
    INSTRUCTIONS: ${ params.instructions }

STUDENT'S CURRENT CODE:
\`\`\`${codeFence}
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
    const isPython = params.languageId === 'python';

    if (q.includes('error') || stderr.length > 0) {
        if (isPython) {
          if (stderr.includes('indentationerror')) {
            return `Python requires consistent indentation!\n\n💡 **Tip**: Make sure your indented blocks under \`def\`, \`if\`, \`for\`, or \`class\` are indented consistently using 4 spaces.`;
          }
          if (stderr.includes('nameerror')) {
            return `Python encountered a NameError!\n\n💡 **Tip**: Check if you misspelled a variable or function name, or used it before assigning or defining it.`;
          }
          if (stderr.includes('syntaxerror')) {
            return `Python encountered a SyntaxError!\n\n💡 **Tip**: Make sure you included a colon \`:\` at the end of \`def\`, \`if\`, \`for\`, or \`class\` headers, and that all parenthesis \`()\` and quotes match.`;
          }
          if (stderr.includes('typeerror')) {
            return `Python reported a TypeError!\n\n💡 **Tip**: Check if you are performing an operation between incompatible types (e.g. adding a string and an integer) without casting with \`str()\` or \`int()\`.`;
          }
          if (stderr.includes('zerodivisionerror')) {
            return `Python raised a ZeroDivisionError!\n\n💡 **Tip**: Division by zero is undefined. Ensure your divisor value cannot evaluate to 0.`;
          }
          return `Let's break down your Python execution attempt:\n\nPython reported an issue in your traceback. Check the line numbers in your console or click line numbers in the Monaco editor for token explanations!`;
        } else {
          if (stderr.includes('undefined')) {
            return `It looks like Go can't find a variable or function in your code!\n\n💡 **Tip**: Check if you misspelled the identifier or forgot to declare it with \`:=\` or \`var\`. In Go, all variables must be declared before use.`;
          }
          if (stderr.includes('expected')) {
            return `Notice the syntax error in your Go code!\n\n💡 **Tip**: Go requires strict syntax around parentheses \`()\`, braces \`{}\`, and package imports. Take a look at the line highlighted in your editor.`;
          }
          return `Let's break down what happened in your execution attempt:\n\nGo reported an issue during compilation. Check the line numbers in your console or try clicking line numbers in the Monaco editor to see line explanations!`;
        }
      }

      if (q.includes('hint') || q.includes('help')) {
        return `Here is a Socratic hint for **${params.exerciseTitle}**:\n\nThink about what the exercise concept (\`${params.concept}\`) requires. Review how ${isPython ? 'Python' : 'Go'} handles syntax and types, and verify that your solution produces the expected output.`;
      }

      if (q.includes('concept') || q.includes('explain')) {
        return `The concept here is **${params.concept}**.\n\nIn ${isPython ? 'Python' : 'Go'}, this dictates how data or control flow is managed. Try modifying your code and clicking **Run** to see how the output changes!`;
      }

      return `Great question! Looking at your code attempt for **${params.exerciseTitle}**, you're on the right track with **${params.concept}**. Modify your solution based on the instructions and hit **Run** to test your logic!`;
    }
  }
