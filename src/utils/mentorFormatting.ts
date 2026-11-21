/**
 * Utilities for cleaning and formatting AI Mentor responses.
 * Ensures output is well-paragraphed, visually structured, and stripped of raw markdown tags
 * so developers can read and follow through comfortably.
 */

export interface MentorParagraph {
  title?: string;
  body: string;
}

/**
 * Strips raw markdown tags (headers, asterisks, bold/italics, backticks, code fences)
 * and normalizes the text into clean, well-spaced paragraphs.
 */
export function cleanMentorText(raw: string): string {
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

/**
 * Splits cleaned AI response text into distinct, non-empty paragraph strings.
 */
export function splitMentorParagraphs(raw: string): string[] {
  const cleaned = cleanMentorText(raw);
  if (!cleaned) return [];
  return cleaned
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Parses an individual paragraph into an optional highlighted title (e.g. for numbered methods)
 * and its accompanying explanation body.
 */
export function parseMentorParagraph(para: string): MentorParagraph {
  const trimmed = para.trim();

  // Match numbered item with title on first line: e.g. "1. errors.Is\nExplanation..."
  const multiLineMatch = trimmed.match(/^(\d+\.\s+[^\n]+)\n+([\s\S]+)$/);
  if (multiLineMatch) {
    return {
      title: multiLineMatch[1].trim(),
      body: multiLineMatch[2].trim(),
    };
  }

  // Match numbered item with colon on single line: e.g. "1. errors.Is: Explanation..."
  const singleLineColonMatch = trimmed.match(/^(\d+\.\s+[^:]+):\s+([\s\S]+)$/);
  if (singleLineColonMatch) {
    return {
      title: singleLineColonMatch[1].trim(),
      body: singleLineColonMatch[2].trim(),
    };
  }

  // Standalone short header or label (e.g. "In-Depth Breakdown: error handling" or "Creating an Error")
  if (trimmed.length < 50 && !trimmed.endsWith('.') && !trimmed.endsWith('?') && !trimmed.endsWith('!')) {
    return {
      title: trimmed,
      body: '',
    };
  }

  return { body: trimmed };
}
