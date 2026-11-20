/**
 * Utilities for cleaning and formatting AI Mentor responses.
 * Ensures output is well-paragraphed and stripped of raw markdown tags
 * so developers can read and follow through comfortably.
 */

/**
 * Strips raw markdown tags (headers, asterisks, bold/italics, backticks, code fences)
 * and normalizes the text into clean, well-spaced paragraphs.
 */
export function cleanMentorText(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // Remove code block fences
  text = text.replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, '$1');

  // Break headers (### Heading) into their own standalone paragraph
  text = text.replace(/(?:^|\n)\s*#{1,6}\s*([^\n]+)/g, '\n\n$1\n\n');
  text = text.replace(/#{1,6}\s*/g, '');

  // Break bullet points (* or - followed by text) into new paragraphs
  text = text.replace(/(?:^|\n)\s*[\*\-•]\s+/g, '\n\n');

  // Break numbered points (1. 2. 3.) into their own paragraphs
  text = text.replace(/(?:^|\n)\s*(\d+\.\s+)/g, '\n\n$1');

  // Strip bold & italic markdown (**bold**, *italic*, __bold__, _italic_)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // Strip inline code backticks (`code` -> code)
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/`+/g, '');

  // Strip any remaining stray formatting asterisks
  text = text.replace(/\*+/g, '');

  // Clean up whitespace: normalize multiple empty lines to double newline
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
