import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import csv = require('csv-parser');
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { CHAT_CONFIG, SEARCH_EXCLUDED_COLUMNS } from './chat.config';
import { buildInitialMessages, CHAT_TOOLS } from './chat.prompts';

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
      const messages: ChatCompletionMessageParam[] =
        buildInitialMessages(userPrompt);

      let maxIterations = CHAT_CONFIG.MAX_TOOL_ITERATIONS;
      while (maxIterations > 0) {
        maxIterations--;

        const response = await this.openai.chat.completions.create({
          model: CHAT_CONFIG.OPENAI_MODEL,
          messages: messages,
          tools: CHAT_TOOLS,
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
              console.log(
                `[ChatService] Executing tool: searchProducts with query="${functionArgs.query}"`,
              );
              const products = await this.searchProducts(functionArgs.query);
              functionResult = JSON.stringify(products);
            } else if (functionName === 'convertCurrencies') {
              console.log(
                `[ChatService] Executing tool: convertCurrencies with amount=${functionArgs.amount}, from=${functionArgs.fromCurrency}, to=${functionArgs.toCurrency}`,
              );
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

      // Escape special regex characters in the user query to prevent runtime errors.
      // The 'i' flag makes the match case-insensitive, replacing the per-value
      // .toLowerCase() call that was previously executed for every column in every row.
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const queryRegex = new RegExp(escapedQuery, 'i');

      const stream = fs
        .createReadStream(CHAT_CONFIG.PRODUCTS_CSV_PATH)
        .pipe(csv());

      stream
        .on('data', (data: Record<string, unknown>) => {
          // Use for...in with a break instead of Object.values().some() to avoid
          // allocating an intermediate array of values on every row.
          // SEARCH_EXCLUDED_COLUMNS.has() is O(1) — skips non-searchable columns
          // such as embeddingText, url, price, variants, etc.
          let isMatch = false;
          for (const key in data) {
            if (
              Object.prototype.hasOwnProperty.call(data, key) &&
              !SEARCH_EXCLUDED_COLUMNS.has(key) &&
              typeof data[key] === 'string' &&
              queryRegex.test(data[key] as string)
            ) {
              isMatch = true;
              break;
            }
          }

          if (isMatch) {
            results.push(data);
            if (results.length === CHAT_CONFIG.MAX_PRODUCTS_PER_SEARCH) {
              stream.destroy();
              resolve(results);
            }
          }
        })
        .on('end', () => {
          if (results.length < CHAT_CONFIG.MAX_PRODUCTS_PER_SEARCH) {
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
      const url = `${CHAT_CONFIG.OPEN_EXCHANGE_BASE_URL}/latest.json?app_id=${appId}`;
      const response = await fetch(url);

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
