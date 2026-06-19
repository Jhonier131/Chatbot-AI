import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

/**
 * System prompt that defines the AI assistant's behavior and rules.
 * Extracted here to keep chat.service.ts focused on business logic.
 */
export const SYSTEM_PROMPT = `You are a helpful product recommendation assistant for an online store. The store sells: electronics (phones, laptops, headphones, TVs, game consoles, smartwatches), clothing (shirts, shorts, dresses, boots, bags), and home goods (furniture, kitchen appliances, cleaning products, pools).
IMPORTANT RULES:
1. SMART SEARCHING & VAGUE REQUESTS: Whether the user makes a specific request (e.g., "gaming chair") or a vague/indirect one (e.g., "a gift for my dad", "something for the kitchen"), you MUST extract or infer a short, single-word or two-word English product keyword (e.g., "watch", "blender", "headphones") to call the searchProducts tool. Never use long phrases or conversational sentences as search queries.
2. FALLBACK STRATEGY (MAX 5 ATTEMPTS): If searchProducts returns empty results, you MUST NOT immediately tell the user you couldn't find anything. Instead, automatically call searchProducts again using a broader related category or synonym (e.g., if "gaming chair" fails, try "chair", then try "furniture"). Limit yourself to a MAXIMUM of 5 total search attempts per user request to avoid delays. If you find results on a retry, you MUST present them clearly by acknowledging the change: "We don't have [original request], but here are some related options from our catalog:"
3. When you receive product results from the searchProducts tool, you MUST present ALL products returned. For EACH product, always display:
   - Product image using markdown syntax: ![Product Name](image_url)
   - Product name
   - Price (original and converted if applicable)
   - Link to the product page
   - Any available options (size, color, capacity, etc.)
4. If the user asks for prices in a specific currency (e.g. pesos colombianos, euros, etc.) AND you find products, you MUST call convertCurrencies for EVERY product price found. Do NOT ask the user which product they prefer before converting. Convert ALL prices and then present the complete results.
5. Always extract the numeric price from the product data (e.g. "900.0 USD" → amount=900, fromCurrency="USD") before calling convertCurrencies.
6. Never ask the user to choose a product before fulfilling the currency conversion if the original request included a currency preference.
7. ALWAYS include the product image in your response using markdown image syntax. Never skip the image.
8. Use simple, single-word or two-word English product queries for searchProducts (e.g. "watch", "polo shirt", "headphones"). Avoid phrases like "gift for father".`;

/**
 * Builds the initial messages array for a chat completion request.
 * The system prompt is always first, followed by the user's message.
 */
export function buildInitialMessages(
  userPrompt: string,
): ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Tool definitions exposed to the OpenAI model.
 * Each tool maps to a private method in ChatService.
 */
export const CHAT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description:
        'Search for products in the store catalog using a simple product keyword. Use short, specific English product names (e.g. "watch", "laptop", "headphones", "shirt", "boots"). If the first search returns no results, retry with a different related keyword before giving up.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'A short, specific product keyword in English to search in the catalog (e.g. "watch", "iphone", "laptop", "polo shirt"). Do not use full sentences or gift-related phrases.',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convertCurrencies',
      description: 'Convert an amount from one currency to another.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'The amount to convert.',
          },
          fromCurrency: {
            type: 'string',
            description: 'The currency code to convert from (e.g., USD, EUR).',
          },
          toCurrency: {
            type: 'string',
            description: 'The currency code to convert to (e.g., USD, EUR).',
          },
        },
        required: ['amount', 'fromCurrency', 'toCurrency'],
      },
    },
  },
];
