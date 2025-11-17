/**
 * Utility functions for detecting and highlighting @mentions in text
 */

export interface Mention {
  username: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Extract @mentions from text
 * Matches @username format (alphanumeric + underscores)
 */
export function extractMentions(text: string): Mention[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: Mention[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return mentions;
}

/**
 * Check if current user is mentioned in text
 */
export function isUserMentioned(text: string, username: string): boolean {
  const mentions = extractMentions(text);
  return mentions.some(m => m.username.toLowerCase() === username.toLowerCase());
}

/**
 * Highlight @mentions in text with styled spans
 */
export function highlightMentions(text: string): string {
  return text.replace(
    /@(\w+)/g,
    '<span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-semibold px-1 rounded">@$1</span>'
  );
}

/**
 * Extract counselor mentions specifically (for notifications)
 */
export function extractCounselorMentions(text: string, counselorUsernames: string[]): string[] {
  const mentions = extractMentions(text);
  const lowercaseCounselors = counselorUsernames.map(u => u.toLowerCase());

  return mentions
    .filter(m => lowercaseCounselors.includes(m.username.toLowerCase()))
    .map(m => m.username);
}
