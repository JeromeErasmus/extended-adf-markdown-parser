/**
 * @file emoji-mapping.ts
 * @description Mapping of emoji shortnames to Unicode codepoints for reliable ADF format
 */

export interface EmojiData {
  id: string;        // Unicode codepoint (e.g., "1f600")
  text: string;      // Unicode character (e.g., "😀")
  shortName: string; // Shortname (e.g., ":grinning:")
}

/**
 * Common emoji mappings for ADF format
 * Using Unicode codepoints as recommended by Atlassian
 */
export const EMOJI_MAP: Record<string, EmojiData> = {
  // Smileys & People
  'grinning': { id: '1f600', text: '😀', shortName: ':grinning:' },
  'smiley': { id: '1f603', text: '😃', shortName: ':smiley:' },
  'smile': { id: '1f604', text: '😄', shortName: ':smile:' },
  'grin': { id: '1f601', text: '😁', shortName: ':grin:' },
  'laughing': { id: '1f606', text: '😆', shortName: ':laughing:' },
  'wink': { id: '1f609', text: '😉', shortName: ':wink:' },
  'blush': { id: '1f60a', text: '😊', shortName: ':blush:' },
  'slightly_smiling_face': { id: '1f642', text: '🙂', shortName: ':slightly_smiling_face:' },
  
  // Objects & Symbols
  'star': { id: '2b50', text: '⭐', shortName: ':star:' },
  'thumbsup': { id: '1f44d', text: '👍', shortName: ':thumbsup:' },
  '+1': { id: '1f44d', text: '👍', shortName: ':+1:' },
  'thumbsdown': { id: '1f44e', text: '👎', shortName: ':thumbsdown:' },
  '-1': { id: '1f44e', text: '👎', shortName: ':-1:' },
  'heart': { id: '2764', text: '❤️', shortName: ':heart:' },
  'fire': { id: '1f525', text: '🔥', shortName: ':fire:' },
  'rocket': { id: '1f680', text: '🚀', shortName: ':rocket:' },
  'tada': { id: '1f389', text: '🎉', shortName: ':tada:' },
  'warning': { id: '26a0', text: '⚠️', shortName: ':warning:' },
  'x': { id: '274c', text: '❌', shortName: ':x:' },
  'white_check_mark': { id: '2705', text: '✅', shortName: ':white_check_mark:' },
  'heavy_check_mark': { id: '2714', text: '✔️', shortName: ':heavy_check_mark:' },
  
  // Nature
  'sunny': { id: '2600', text: '☀️', shortName: ':sunny:' },
  'cloud': { id: '2601', text: '☁️', shortName: ':cloud:' },
  'umbrella': { id: '2614', text: '☔', shortName: ':umbrella:' },
  'snowflake': { id: '2744', text: '❄️', shortName: ':snowflake:' },
  
  // Food
  'coffee': { id: '2615', text: '☕', shortName: ':coffee:' },
  'pizza': { id: '1f355', text: '🍕', shortName: ':pizza:' },
  'hamburger': { id: '1f354', text: '🍔', shortName: ':hamburger:' },
  
  // Activities
  'soccer': { id: '26bd', text: '⚽', shortName: ':soccer:' },
  'basketball': { id: '1f3c0', text: '🏀', shortName: ':basketball:' },
  'football': { id: '1f3c8', text: '🏈', shortName: ':football:' }
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
    id: shortName.replace(/[^a-zA-Z0-9]/g, ''), // Use shortname as fallback ID
    text: normalizedShortName, // Show shortname as text fallback
    shortName: normalizedShortName
  };
}