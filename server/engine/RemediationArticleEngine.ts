import type { SectionQuiz, QuizQuestion, RemediationArticle } from '../../src/types';

interface GenerateRemediationParams {
  quiz: SectionQuiz;
  question: QuizQuestion;
  selectedOptionId: string;
  email?: string;
}

// In-memory cache for generated remediation articles by (questionId:selectedOptionId)
const articleCache = new Map<string, RemediationArticle>();

export class RemediationArticleEngine {
  /**
   * Generates or retrieves a targeted remediation guide for a missed quiz question.
   */
  public static async generateArticle(params: GenerateRemediationParams): Promise<RemediationArticle> {
    const { quiz, question, selectedOptionId } = params;
    const cacheKey = `${question.id}:${selectedOptionId || 'unanswered'}`;

    if (articleCache.has(cacheKey)) {
      return articleCache.get(cacheKey)!;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let markdown: string | null = null;

    if (apiKey) {
      try {
        markdown = await this.callGeminiForArticle(apiKey, params);
      } catch (err: any) {
        console.error('[RemediationArticleEngine] Gemini API generation error:', err.message);
      }
    }

    // If Gemini is unavailable, offline, or returns empty, use the rich deterministic fallback
    if (!markdown) {
      markdown = this.generateFallbackArticle(params);
    }

    const cleanMarkdown = this.cleanAndFormatMarkdown(markdown);
    const keyTakeaways = this.extractKeyTakeaways(cleanMarkdown, question);

    const article: RemediationArticle = {
      articleId: `rem-${question.id}-${selectedOptionId || 'none'}`,
      questionId: question.id,
      quizId: quiz.id,
      title: this.deriveArticleTitle(question, quiz),
      conceptTag: question.conceptTag || 'software-engineering',
      topicTitle: quiz.title,
      estimatedReadMinutes: Math.max(2, Math.ceil(cleanMarkdown.split(/\s+/).length / 180)),
      markdown: cleanMarkdown,
      keyTakeaways,
      diagnosticSummary: this.deriveDiagnosticSummary(question, selectedOptionId),
      recommendedNextStep: 'Review the rules of thumb below, then retake the question to solidify your mental model.',
    };

    articleCache.set(cacheKey, article);
    return article;
  }

  private static deriveArticleTitle(question: QuizQuestion, quiz: SectionQuiz): string {
    if (question.conceptTag) {
      const formatted = question.conceptTag
        .replace(/^(go|py|ts|js)-/, '')
        .replace(/-vs-/g, ' vs. ')
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return `Understanding ${formatted}`;
    }
    return `Deep Dive: ${quiz.title}`;
  }

  private static deriveDiagnosticSummary(question: QuizQuestion, selectedOptionId: string): string {
    const selectedOpt = question.options.find((o) => o.id === selectedOptionId);
    const correctOpt = question.options.find((o) => o.id === question.correctOptionId);

    if (selectedOpt && correctOpt) {
      return `You selected "${selectedOpt.text.slice(0, 80)}...", but the production standard is "${correctOpt.text.slice(0, 80)}...".`;
    }
    return 'Understanding the underlying system behavior and architectural trade-offs.';
  }

  private static extractKeyTakeaways(markdown: string, question: QuizQuestion): string[] {
    const takeaways: string[] = [];
    const lines = markdown.split('\n');
    let inTakeaways = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('rules of thumb') || line.toLowerCase().includes('key takeaways')) {
        inTakeaways = true;
        continue;
      }
      if (inTakeaways) {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s+/.test(trimmed)) {
          const clean = trimmed.replace(/^[\*\-\d\.\s]+/, '').trim();
          if (clean.length > 10) {
            takeaways.push(clean);
          }
        } else if (trimmed.startsWith('#')) {
          break;
        }
      }
    }

    if (takeaways.length === 0) {
      takeaways.push(question.explanation);
      const correctOpt = question.options.find((o) => o.id === question.correctOptionId);
      if (correctOpt) {
        takeaways.push(`Correct approach: ${correctOpt.text}`);
      }
    }

    return takeaways.slice(0, 4);
  }

  private static async callGeminiForArticle(
    apiKey: string,
    params: GenerateRemediationParams
  ): Promise<string | null> {
    const { quiz, question, selectedOptionId } = params;
    const selectedOpt = question.options.find((o) => o.id === selectedOptionId);
    const correctOpt = question.options.find((o) => o.id === question.correctOptionId);

    const systemPrompt = `You are a Principal Staff Software Engineer and Master Technical Tutor at CodeForge.
A software engineer just answered a practical engineering scenario question incorrectly.
Your mission is to write a targeted, comprehensive, and direct remediation guide to permanently fix their mental model.

CRITICAL WRITING & STYLE RULES:
1. SIMPLE EVERYDAY ENGLISH:
   - Explain technical mechanics using plain, direct, conversational language and intuitive analogies.
   - Avoid dense academic jargon or pretentious prose. Speak developer-to-developer.

2. WELL-PARAGRAPHED & CLEAN SPACING:
   - Keep paragraphs short (2 to 3 sentences maximum).
   - Separate distinct ideas with clean paragraph breaks (double newlines).
   - Never output a single massive wall of text.

3. DIRECT & PRACTICAL:
   - Start immediately with the diagnosis. Do NOT include opening greetings or filler like "Welcome to this guide", "In this article we will learn", or "Hello student".

4. FIVE-PART STRUCTURE (REQUIRED):
   # Diagnostic Guide: <Clear Topic Title>

   ## 1. The Trap: What Led to Your Choice
   Directly address why choosing "${selectedOpt?.text || 'this answer'}" is a common intuitive mistake in engineering, and the subtle flaw in that mental assumption.

   ## 2. The Mental Model: How It Actually Works Under the Hood
   Explain the real physical mechanism step-by-step (e.g. how the cache, kernel, database engine, or network protocol operates). Use a simple everyday analogy.

   ## 3. Production Reality: Fragile Pattern vs. Hardened Pattern
   Provide a concrete code, configuration, or query comparison demonstrating the failure mode vs. the production-grade solution.

   ## 4. Distractor Autopsy: Option-by-Option Breakdown
   Walk through each of the 4 options:
   - Explain why the correct option (${correctOpt?.id.toUpperCase()}: "${correctOpt?.text}") is standard.
   - Explain why the other options are either flawed, irrelevant, or traps.

   ## 5. Senior Engineer Rules of Thumb
   List 3 to 4 bullet points of high-leverage heuristics to remember for production design and interviews.`;

    const userPrompt = `TOPIC: ${quiz.title} (${quiz.domainLabel || quiz.domain || 'Software Engineering'})
DIFFICULTY: ${question.difficulty || 'intermediate'}
CONCEPT: ${question.conceptTag || 'system-architecture'}

QUESTION:
${question.question}

${question.codeSnippet ? `CODE/CONFIGURATION SNIPPET:\n\`\`\`\n${question.codeSnippet}\n\`\`\`\n` : ''}

OPTIONS:
${question.options.map((o) => `- [${o.id.toUpperCase()}] ${o.text}`).join('\n')}

STUDENT'S CHOICE (INCORRECT):
Option ${selectedOpt ? selectedOpt.id.toUpperCase() : 'None'}: "${selectedOpt?.text || 'Unanswered'}"

CORRECT OPTION:
Option ${correctOpt?.id.toUpperCase()}: "${correctOpt?.text}"

OFFICIAL EXPLANATION:
${question.explanation}

Write the complete remediation guide now following the required 5-part structure.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2500,
          temperature: 0.3,
        },
      }),
    });

    if (!res.ok) {
      // Fallback model
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { maxOutputTokens: 2500, temperature: 0.3 },
        }),
      });

      if (!fallbackRes.ok) return null;
      const data = await fallbackRes.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  private static generateFallbackArticle(params: GenerateRemediationParams): string {
    const { quiz, question, selectedOptionId } = params;
    const selectedOpt = question.options.find((o) => o.id === selectedOptionId);
    const correctOpt = question.options.find((o) => o.id === question.correctOptionId);

    const title = this.deriveArticleTitle(question, quiz);

    return `# Diagnostic Guide: ${title}

## 1. The Trap: What Led to Your Choice

When tackling this problem, picking "${selectedOpt?.text || 'your selected option'}" is an easy trap to fall into. It sounds plausible on the surface because it seems to solve the immediate symptom.

However, in production systems, this approach fails to account for how the underlying component actually coordinates state, network boundaries, and concurrency. 

The real challenge here is not just getting the request through, but ensuring consistency, reliability, and clean failure modes when systems experience network latency, sudden restarts, or concurrent traffic.

## 2. The Mental Model: How It Actually Works Under the Hood

To understand why this happens, think of the system like a physical conveyor belt with a strict gatekeeper:

Every request must pass through multiple layers—from client socket to proxy cache, application thread, and persistent storage. Each layer maintains its own set of guarantees and assumptions.

When a client sends a request or when data is written:
1. The gatekeeper checks whether the operation can be completed safely without violating idempotency or isolation invariants.
2. If the operation relies on a stale assumption or an invalid header, the system cannot verify the state of the resource.
3. Rather than guessing, production-grade infrastructure relies on deterministic signals like unique idempotency tokens, atomic compare-and-swap barriers, or content-hashed validators.

Because of this design, trying to work around the problem at the wrong layer only leads to silent data corruption, lost updates, or unexpected downtime.

## 3. Production Reality: Fragile Pattern vs. Hardened Pattern

Here is what this looks like in practice. Notice the difference between the fragile intuition and the production-hardened design:

\`\`\`
// FRAGILE APPROACH (Vulnerable to state corruption or race conditions)
${question.codeSnippet || '// Reliance on unvalidated client retries or uncoordinated writes\n// Causes duplicate processing or stale reads under load'}

// PRODUCTION-HARDENED APPROACH
${question.explanation}
\`\`\`

In the hardened pattern, the system avoids assumptions. It uses explicit contracts, strict error boundaries, and validated states before committing mutations.

## 4. Distractor Autopsy: Option-by-Option Breakdown

Let's examine every choice from the question to see exactly why the correct answer stands out and why the others fail:

* **Option ${correctOpt?.id.toUpperCase()} (Correct): "${correctOpt?.text}"**
  ${question.explanation} This is the standard pattern recommended by production engineering specifications.

${question.options
  .filter((o) => o.id !== question.correctOptionId)
  .map(
    (o) =>
      `* **Option ${o.id.toUpperCase()} (Incorrect): "${o.text}"**\n  While this may seem tempting, it does not solve the root invariant. ${
        o.id === selectedOptionId
          ? 'This was your selection. It fails because it misinterprets how the underlying protocol or engine coordinates execution.'
          : 'It introduces unnecessary latency, violates protocol standards, or leaves the system vulnerable to edge-case failures.'
      }`
  )
  .join('\n\n')}

## 5. Senior Engineer Rules of Thumb

Keep these practical heuristics in mind whenever you encounter this pattern in production code or technical interviews:

* **Verify the invariant first**: Always identify whether the operation requires strict idempotency, cache validation, or atomic synchronization before choosing an API or query pattern.
* **Never assume single-flight execution**: In distributed systems, networks will retry, timeouts will trigger, and duplicate packets will arrive. Always design handlers to tolerate retries safely.
* **Favor explicit contracts over implicit assumptions**: Always rely on standard RFC status codes, headers, and engine primitives rather than inventing custom workarounds.
`;
  }

  private static cleanAndFormatMarkdown(raw: string): string {
    if (!raw) return '';
    let text = raw;

    // Remove any accidental meta-announcements at the beginning
    text = text.replace(/^Here is (your|the) remediation guide:?\s*/i, '');
    text = text.replace(/^Certainly!?\s*/i, '');

    // Normalize line breaks
    text = text.replace(/\r\n/g, '\n');

    // Ensure headers have blank lines before and after
    text = text.replace(/([^\n])\n(#{1,4}\s+[^\n]+)/g, '$1\n\n$2');
    text = text.replace(/(#{1,4}\s+[^\n]+)\n([^\n#])/g, '$1\n\n$2');

    // Ensure list items are well spaced
    text = text.replace(/([^\n])\n(\*\s+[^\n]+)/g, '$1\n\n$2');

    return text.trim();
  }
}
