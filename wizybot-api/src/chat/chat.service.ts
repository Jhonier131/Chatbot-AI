import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import csv = require('csv-parser');
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

/**
 * Service responsible for interacting with the OpenAI API.
 * It processes the chat and handles local function calls.
 */
@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Main method to process the user prompt using OpenAI tool calling.
   * It checks if a tool is needed, executes it, and returns the final AI response.
   */
  async processEnquiry(userPrompt: string): Promise<string> {
    try {
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content:
            'You are a helpful product recommendation assistant for an online store. The store sells: electronics (phones, laptops, headphones, TVs, game consoles, smartwatches), clothing (shirts, shorts, dresses, boots, bags), and home goods (furniture, kitchen appliances, cleaning products, pools).\n' +
            'IMPORTANT RULES:\n' +
            '1. SMART SEARCHING & VAGUE REQUESTS: Whether the user makes a specific request (e.g., "gaming chair") or a vague/indirect one (e.g., "a gift for my dad", "something for the kitchen"), you MUST extract or infer a short, single-word or two-word English product keyword (e.g., "watch", "blender", "headphones") to call the searchProducts tool. Never use long phrases or conversational sentences as search queries.\n' +
            '2. FALLBACK STRATEGY (MAX 5 ATTEMPTS): If searchProducts returns empty results, you MUST NOT immediately tell the user you couldn\'t find anything. Instead, automatically call searchProducts again using a broader related category or synonym (e.g., if "gaming chair" fails, try "chair", then try "furniture"). Limit yourself to a MAXIMUM of 5 total search attempts per user request to avoid delays. If you find results on a retry, you MUST present them clearly by acknowledging the change: "We don\'t have [original request], but here are some related options from our catalog:"\n' +
            '3. When you receive product results from the searchProducts tool, you MUST present ALL products returned. For EACH product, always display:\n' +
            '   - Product image using markdown syntax: ![Product Name](image_url)\n' +
            '   - Product name\n' +
            '   - Price (original and converted if applicable)\n' +
            '   - Link to the product page\n' +
            '   - Any available options (size, color, capacity, etc.)\n' +
            '4. If the user asks for prices in a specific currency (e.g. pesos colombianos, euros, etc.) AND you find products, you MUST call convertCurrencies for EVERY product price found. Do NOT ask the user which product they prefer before converting. Convert ALL prices and then present the complete results.\n' +
            '5. Always extract the numeric price from the product data (e.g. "900.0 USD" → amount=900, fromCurrency="USD") before calling convertCurrencies.\n' +
            '6. Never ask the user to choose a product before fulfilling the currency conversion if the original request included a currency preference.\n' +
            '7. ALWAYS include the product image in your response using markdown image syntax. Never skip the image.\n' +
            '8. Use simple, single-word or two-word English product queries for searchProducts (e.g. "watch", "polo shirt", "headphones"). Avoid phrases like "gift for father".',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ];

      const tools: ChatCompletionTool[] = [
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
                  description:
                    'The currency code to convert from (e.g., USD, EUR).',
                },
                toCurrency: {
                  type: 'string',
                  description:
                    'The currency code to convert to (e.g., USD, EUR).',
                },
              },
              required: ['amount', 'fromCurrency', 'toCurrency'],
            },
          },
        },
      ];

      let maxIterations = 6;
      while (maxIterations > 0) {
        maxIterations--;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          tools: tools,
          tool_choice: 'auto',
        });

        const responseMessage = response.choices[0].message;

        if (responseMessage.tool_calls) {
          messages.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            if (toolCall.type !== 'function') continue;
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);
            let functionResult = '';

            if (functionName === 'searchProducts') {
              console.log(`[ChatService] Executing tool: searchProducts with query="${functionArgs.query}"`);
              const products = await this.searchProducts(functionArgs.query);
              functionResult = JSON.stringify(products);
            } else if (functionName === 'convertCurrencies') {
              console.log(`[ChatService] Executing tool: convertCurrencies with amount=${functionArgs.amount}, from=${functionArgs.fromCurrency}, to=${functionArgs.toCurrency}`);
              const conversion = await this.convertCurrencies(
                functionArgs.amount,
                functionArgs.fromCurrency,
                functionArgs.toCurrency,
              );
              functionResult = JSON.stringify(conversion);
            }

            messages.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              content: functionResult,
            });
          }
          // Continue the loop to let the LLM evaluate the tool results
        } else {
          // No more tool calls, return the final content
          return responseMessage.content || '';
        }
      }

      return 'Error: Exceeded maximum tool execution iterations.';
    } catch (error) {
      console.error('Error during LLM processing:', error);
      throw new InternalServerErrorException(
        'Failed to process the chat enquiry.',
      );
    }
  }

  /**
   * Reads the local CSV file to find matching products.
   * It stops and returns exactly 2 items to optimize memory.
   */
  private async searchProducts(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const lowerCaseQuery = query.toLowerCase();

      const stream = fs.createReadStream('products_list.csv').pipe(csv());

      stream
        .on('data', (data) => {
          const isMatch = Object.values(data).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(lowerCaseQuery),
          );

          if (isMatch) {
            results.push(data);
            if (results.length === 2) {
              stream.destroy();
              resolve(results);
            }
          }
        })
        .on('end', () => {
          if (results.length < 2) {
            resolve(results);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Fetches the latest exchange rates and converts the requested amount.
   */
  private async convertCurrencies(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<any> {
    try {
      const appId = process.env.OPEN_EXCHANGE_APP_ID;
      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${appId}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Open Exchange Rates API');
      }

      const data = await response.json();

      if (!data.rates) {
        throw new Error('Rates not available in the API response');
      }

      const fromRate = data.rates[fromCurrency.toUpperCase()];
      const toRate = data.rates[toCurrency.toUpperCase()];

      if (!fromRate || !toRate) {
        return { error: 'Invalid currency code provided.' };
      }

      const amountInUSD = amount / fromRate;
      const convertedAmount = amountInUSD * toRate;

      return {
        originalAmount: amount,
        originalCurrency: fromCurrency.toUpperCase(),
        convertedAmount: parseFloat(convertedAmount.toFixed(2)),
        convertedCurrency: toCurrency.toUpperCase(),
      };
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      throw new InternalServerErrorException('Currency conversion failed.');
    }
  }
}
