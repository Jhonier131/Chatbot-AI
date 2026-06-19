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
