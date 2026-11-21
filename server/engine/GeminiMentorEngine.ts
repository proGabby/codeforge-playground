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
        if (responseText) {
          return this.cleanMentorText(responseText);
        }
      } catch (err: any) {
        console.error('[GeminiMentorEngine] Gemini API call error:', err.message);
      }
    }

    // Fallback Socratic mentor response generator if API key missing or network fails
    return this.cleanMentorText(this.generateFallbackResponse(params));
  }

  /**
   * Sanitizes AI response text to ensure zero raw markdown tags (#, *, **, `)
   * and normalizes spacing into clean, well-spaced paragraphs and lists.
   */
  public static cleanMentorText(raw: string): string {
    if (!raw) return '';

    let text = raw;

    // 1. Remove code block fences
    text = text.replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, '$1');

    // 2. Break headers (### Heading) into their own standalone paragraph
    text = text.replace(/(?:^|\n)\s*#{1,6}\s*([^\n]+)/g, '\n\n$1\n\n');
    text = text.replace(/#{1,6}\s*/g, '');

    // 3. Strip bold & italic markdown (**bold**, *italic*, __bold__, _italic_)
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');

    // 4. Strip inline code backticks (`code` -> code)
    text = text.replace(/`([^`]+)`/g, '$1');
    text = text.replace(/`+/g, '');

    // 5. Break inline numbered items (e.g. "...about. 1. errors.Is..." or "...chain. 2. errors.As...")
    // into separate paragraphs
    text = text.replace(/(?:^|[\.\?!]\s+|\n\s*)(\d+\.\s+)/g, '.\n\n$1');
    text = text.replace(/\.{2,}\n\n/g, '.\n\n');

    // 6. Break bullet points (* item, - item, • item) into new paragraphs
    text = text.replace(/(?:^|\n)\s*[\*\-•]\s+/g, '\n\n');

    // 7. Split natural thought transitions:
    // e.g. "...appropriately. In modern Go..." -> paragraph break
    text = text.replace(/([\.\?!])\s+(In modern Go|In Go|In Python|Beyond [a-zA-Z0-9_\.]+,|Here are|Let's address|Take a look)/g, '$1\n\n$2');

    // 8. If closing question at the end:
    // e.g. "...errors.As. Would you like..." -> break into its own paragraph
    text = text.replace(/([\.\?!])\s+(Would you like|Do you want|Let me know|Feel free to|What part of)/g, '$1\n\n$2');

    // 9. If a numbered item has a function name or title immediately followed by "This function", "Introduced in", "Checks", etc.:
    // e.g. "1. errors.Is This function" -> "1. errors.Is\nThis function"
    text = text.replace(/(\d+\.\s+[A-Za-z0-9_.]+(?:\s*\([^)]*\))?)\s+(This function|Introduced in|Checks|Unpacks|Combines|Returns|Used for|Allows|When|If)/g, '$1\n$2');

    // 10. Strip stray asterisks
    text = text.replace(/\*+/g, '');

    // 11. Normalize multiple newlines
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }

  private static async callGeminiAPI(apiKey: string, params: MentorRequestParams): Promise<string | null> {
    const isPython = params.languageId === 'python';
    const langName = isPython ? 'Python' : 'Go (Golang)';
    const codeFence = isPython ? 'python' : 'go';

    const systemPrompt = `You are CodeForge AI Mentor, an expert Socratic ${langName} programming instructor and software engineer.
Your mission is to help developers learn ${langName} deeply through first principles, clear mental models, and precise explanations.

CRITICAL FORMATTING & STYLE INSTRUCTIONS:
1. ZERO MARKDOWN SYNTAX SYMBOLS:
   - Do NOT use markdown headers (never use #, ##, ###).
   - Do NOT use asterisks for bold or italics (never use **word** or *word*).
   - Do NOT use asterisks or hyphens for bullet points (do NOT write "* item" or "- item").
   - Do NOT use backticks around code names or keywords (write code, types, and function names plainly, e.g. fmt.Println, errors.Is, %w, float64).
   - Write in clean, natural plain English with zero markdown characters.

2. CLEAR, SPACED PARAGRAPHING:
   - Break your response into short, well-spaced paragraphs (2 to 3 sentences per paragraph).
   - Separate every distinct paragraph or idea with a double newline (\n\n).
   - Never write a dense wall of text.

3. NUMBERED LIST FORMAT (STRICT):
   When listing methods, steps, or multiple items, format each item with its title on the first line, followed by its explanation on the next line, and a blank line before the next item. For example:

   1. methodName
   Explanation of what it does and when to use it.

   2. methodName
   Explanation of what it does and when to use it.

4. COMPLETE RESPONSES:
   - Never stop mid-sentence. Always conclude with a helpful follow-up question or suggestion.

CORE TEACHING PRINCIPLES:
1. ADAPTIVE DEPTH & THOROUGH EXPLANATIONS:
   - When the student asks for "more details", "explain further", "how does this work under the hood?", or asks about concepts and mechanics, provide a comprehensive, step-by-step breakdown.
   - Walk through the mechanics step-by-step: explain the underlying runtime behavior, memory models, execution order, and why the language is designed that way.
2. SOCRATIC GUIDANCE ON EXERCISES:
   - When a student is debugging an error or test failure, explain what happened and why in plain English, and ask thoughtful guiding questions to help them fix their code.
   - Do NOT dump the full completed solution code for the exercise unless the student explicitly demands "give me the solution" or "show me the code".
3. TONE:
   - Be encouraging, technical, clear, patient, and conversational.`;

    let contextPrompt = `EXERCISE: ${params.exerciseTitle} (${params.concept})
INSTRUCTIONS: ${params.instructions}
`;

    if (params.userCode) {
      contextPrompt += `\nSTUDENT'S CURRENT CODE:
\`\`\`${codeFence}
${params.userCode}
\`\`\`
`;
    }

    if (params.stdout || params.stderr) {
      contextPrompt += `\nLAST EXECUTION ATTEMPT:
STDOUT: ${params.stdout || '(None)'}
STDERR: ${params.stderr || '(None)'}
`;
    }

    // Build multi-turn conversation contents array
    const contents: any[] = [];

    if (params.chatHistory && params.chatHistory.length > 0) {
      // Seed first turn with instructions and context
      contents.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${contextPrompt}\nI am working on this exercise and will ask you questions.` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood! I'm ready to mentor you through ${params.exerciseTitle}. Ask me anything, and feel free to request as much detail or depth as you need!` }],
      });

      // Add prior chat history
      for (const msg of params.chatHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }

      // Current prompt with user question
      contents.push({
        role: 'user',
        parts: [{ text: `[Current code status: ${params.userCode ? `\`\`\`${codeFence}\n${params.userCode}\n\`\`\`` : 'same'}]\n\nStudent question: "${params.question}"` }],
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${contextPrompt}\n\nSTUDENT QUESTION: "${params.question}"` }],
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.3,
        },
      }),
    });

    if (!res.ok) {
      // Fallback to gemini-flash-latest if needed
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      const resFallback = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.3,
          },
        }),
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
    const isDetail = /detail|explain\s+more|elaborate|deep|under\s+the\s+hood|how\s+does|why\s+does|internals/i.test(q);

    if (isDetail) {
      if (isPython) {
        return (
          `In-Depth Breakdown: ${params.concept}\n\n` +
          `Here is how Python handles ${params.concept} under the hood:\n\n` +
          `1. Execution Mechanics\nPython compiles your source code into bytecode instructions run by the CPython virtual machine. Operations are executed dynamically with reference counting garbage collection.\n\n` +
          `2. Memory & Types\nEvery object in Python has a type, value, and reference count. When creating variables or structures, Python allocates memory on the heap and binds variable names in the local namespace dictionary.\n\n` +
          `3. Key Idioms\nAim for readable, Pythonic patterns. Avoid manual index tracking when iteration or built-in functions can express the intent directly.\n\n` +
          `Would you like to examine a specific line in your code or trace how a particular variable behaves at runtime?`
        );
      } else {
        return (
          `In-Depth Breakdown: ${params.concept}\n\n` +
          `Here is a deeper look at how Go manages ${params.concept}:\n\n` +
          `1. Memory & Allocation\nGo uses a fast stack allocator for values whose lifetime is bounded, and escapes variables to the heap only when necessary via escape analysis. Value types copy by default unless passed by pointer.\n\n` +
          `2. Runtime Mechanics\nGo's runtime is statically typed and garbage-collected with zero-cost abstractions wherever possible. Slices, for example, are 3-word headers (pointer, length, capacity) over a backing array.\n\n` +
          `3. Idiomatic Patterns\nGo favors explicit error handling, minimal magic, and clean composition over inheritance.\n\n` +
          `Which part of the implementation would you like to unpack further?`
        );
      }
    }

    if (q.includes('error') || stderr.length > 0) {
      if (isPython) {
        if (stderr.includes('indentationerror')) {
          return `Python requires consistent indentation!\n\nTip: Make sure your indented blocks under def, if, for, or class are indented consistently using 4 spaces.`;
        }
        if (stderr.includes('nameerror')) {
          return `Python encountered a NameError!\n\nTip: Check if you misspelled a variable or function name, or used it before assigning or defining it.`;
        }
        if (stderr.includes('syntaxerror')) {
          return `Python encountered a SyntaxError!\n\nTip: Make sure you included a colon : at the end of def, if, for, or class headers, and that all parentheses and quotes match.`;
        }
        if (stderr.includes('typeerror')) {
          return `Python reported a TypeError!\n\nTip: Check if you are performing an operation between incompatible types without casting using str() or int().`;
        }
        if (stderr.includes('zerodivisionerror')) {
          return `Python raised a ZeroDivisionError!\n\nTip: Division by zero is undefined. Ensure your divisor value cannot evaluate to 0.`;
        }
        return `Let's break down your Python execution attempt:\n\nPython reported an issue in your traceback. Check the line numbers in your console or ask for a deeper breakdown of any error line!`;
      } else {
        if (stderr.includes('undefined')) {
          return `It looks like Go can't find a variable or function in your code!\n\nTip: Check if you misspelled the identifier or forgot to declare it with := or var. In Go, all variables must be declared before use.`;
        }
        if (stderr.includes('expected')) {
          return `Notice the syntax error in your Go code!\n\nTip: Go requires strict syntax around parentheses, braces, and package imports. Take a look at the line highlighted in your editor.`;
        }
        return `Let's break down what happened in your execution attempt:\n\nGo reported an issue during compilation. Check the line numbers in your console or ask me to explain what the compiler is complaining about in detail!`;
      }
    }

    if (q.includes('hint') || q.includes('help')) {
      return `Here is a Socratic hint for ${params.exerciseTitle}:\n\nThink about what the exercise concept (${params.concept}) requires. Review how ${isPython ? 'Python' : 'Go'} handles syntax and types, and verify that your solution produces the expected output.`;
    }

    if (q.includes('concept') || q.includes('explain')) {
      return `The concept here is ${params.concept}.\n\nIn ${isPython ? 'Python' : 'Go'}, this dictates how data or control flow is managed. Try modifying your code and clicking Run to see how the output changes! Ask me if you'd like a deep dive into the runtime mechanics.`;
    }

    return `Great question! Looking at your code attempt for ${params.exerciseTitle}, you're working with ${params.concept}. What part of the syntax or logic would you like to explore in more detail?`;
  }
}
