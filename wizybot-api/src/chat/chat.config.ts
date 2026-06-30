/**
 * Centralized configuration constants for the Chat module.
 * Keep all "magic strings" and environment-driven values here.
 */
export const CHAT_CONFIG = {
  /** OpenAI model used for chat completions */
  OPENAI_MODEL: 'gpt-3.5-turbo' as const,

  /** Max number of tool-call loops before giving up */
  MAX_TOOL_ITERATIONS: 6,

  /** Maximum number of product results to return per search */
  MAX_PRODUCTS_PER_SEARCH: 2,

  /** Base URL for the Open Exchange Rates API */
  OPEN_EXCHANGE_BASE_URL: 'https://openexchangerates.org/api',

  /** Local CSV file path relative to project root */
  PRODUCTS_CSV_PATH: 'products_list.csv',
} as const;

/**
 * Set of CSV column names that should be excluded from the full-text search.
 * Using a Set provides O(1) lookups instead of O(n) array scans on every
 * column of every row, keeping the hot path as lean as possible.
 *
 * Excluded because they are either internal/embedding data, URLs, or
 * numeric/structured fields that are not meaningful for keyword search.
 */
export const SEARCH_EXCLUDED_COLUMNS = new Set([
  'url',
  'imageUrl',
  'discount',
  'price',
  'variants',
  'createDate',
]);

