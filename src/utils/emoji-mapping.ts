/**
 * @file emoji-mapping.ts
 * @description Mapping of emoji shortnames to Unicode codepoints for reliable ADF format
 */

export interface EmojiData {
  shortName: string; // Shortname (e.g., ":grinning:")
  text: string;      // Unicode character (e.g., "😀")
  id?: string;       // Optional: Unicode codepoint for non-standard emojis
}

/**
 * Common emoji mappings for ADF format
 * Following official Atlassian documentation structure for Unicode emojis
 */
export const EMOJI_MAP: Record<string, EmojiData> = {
  // Smileys & People
  'grinning': { shortName: ':grinning:', text: '😀' },
  'smiley': { shortName: ':smiley:', text: '😃' },
  'smile': { shortName: ':smile:', text: '😄' },
  'grin': { shortName: ':grin:', text: '😁' },
  'laughing': { shortName: ':laughing:', text: '😆' },
  'wink': { shortName: ':wink:', text: '😉' },
  'blush': { shortName: ':blush:', text: '😊' },
  'slightly_smiling_face': { shortName: ':slightly_smiling_face:', text: '🙂' },
  
  // Objects & Symbols
  'star': { shortName: ':star:', text: '⭐' },
  'thumbsup': { shortName: ':thumbsup:', text: '👍' },
  '+1': { shortName: ':+1:', text: '👍' },
  'thumbsdown': { shortName: ':thumbsdown:', text: '👎' },
  '-1': { shortName: ':-1:', text: '👎' },
  'heart': { shortName: ':heart:', text: '❤️' },
  'fire': { shortName: ':fire:', text: '🔥' },
  'rocket': { shortName: ':rocket:', text: '🚀' },
  'tada': { shortName: ':tada:', text: '🎉' },
  'warning': { shortName: ':warning:', text: '⚠️' },
  'x': { shortName: ':x:', text: '❌' },
  'white_check_mark': { shortName: ':white_check_mark:', text: '✅' },
  'heavy_check_mark': { shortName: ':heavy_check_mark:', text: '✔️' },
  'clapping_hands': { shortName: ':clapping_hands:', text: '👏' },
  'muscle': { shortName: ':muscle:', text: '💪' },
  'handshake': { shortName: ':handshake:', text: '🤝' },
  'trophy': { shortName: ':trophy:', text: '🏆' },
  'memo': { shortName: ':memo:', text: '📝' },
  'calendar': { shortName: ':calendar:', text: '📅' },
  
  // Nature
  'sunny': { shortName: ':sunny:', text: '☀️' },
  'cloud': { shortName: ':cloud:', text: '☁️' },
  'umbrella': { shortName: ':umbrella:', text: '☔' },
  'snowflake': { shortName: ':snowflake:', text: '❄️' },
  
  // Food
  'coffee': { shortName: ':coffee:', text: '☕' },
  'pizza': { shortName: ':pizza:', text: '🍕' },
  'hamburger': { shortName: ':hamburger:', text: '🍔' },
  
  // Activities
  'soccer': { shortName: ':soccer:', text: '⚽' },
  'basketball': { shortName: ':basketball:', text: '🏀' },
  'football': { shortName: ':football:', text: '🏈' }
};

/**
 * Get emoji data by shortname (without colons)
 */
export function getEmojiData(shortName: string): EmojiData | null {
  const normalizedName = shortName.replace(/^:/, '').replace(/:$/, '');
  return EMOJI_MAP[normalizedName] || null;
}

/**
 * Create fallback emoji data for unknown emojis
 */
export function createFallbackEmojiData(shortName: string): EmojiData {
  const normalizedShortName = shortName.startsWith(':') ? shortName : `:${shortName}:`;
  
  return {
    shortName: normalizedShortName,
    text: normalizedShortName, // Show shortname as text fallback
    id: shortName.replace(/[^a-zA-Z0-9]/g, '') // Use shortname as fallback ID for non-Unicode
  };
}