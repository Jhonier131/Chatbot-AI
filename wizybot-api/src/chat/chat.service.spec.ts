import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';

// Mock the OpenAI SDK
const mockCreate = jest.fn();
jest.mock('openai', () =>
  jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
);

// Mock global fetch (used by convertCurrencies)
global.fetch = jest.fn();

// Mock fs and csv-parser to avoid real file reads
jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    destroy: jest.fn(),
  }),
}));
jest.mock('csv-parser', () => jest.fn().mockReturnValue({}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const textResponse = (content: string) => ({
  choices: [{ message: { content, tool_calls: null } }],
});

const toolCallResponse = (name: string, args: object) => ({
  choices: [
    {
      message: {
        content: null,
        tool_calls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name, arguments: JSON.stringify(args) },
          },
        ],
      },
    },
  ],
});

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------
describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    mockCreate.mockReset();
    (global.fetch as jest.Mock).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // LLM responds directly without using any tool
  it('should return the LLM text when no tool is needed', async () => {
    mockCreate.mockResolvedValue(textResponse('Hello! How can I help?'));

    const result = await service.processEnquiry('Hi');

    expect(result).toBe('Hello! How can I help?');
  });

  // LLM requests the searchProducts tool and then responds
  it('should handle a searchProducts tool call and return the final answer', async () => {
    mockCreate
      .mockResolvedValueOnce(toolCallResponse('searchProducts', { query: 'iphone' }))
      .mockResolvedValueOnce(textResponse('Here are 2 iPhones for you!'));

    // Simulate the CSV stream ending with no results
    const mockStream = {
      on: jest.fn().mockImplementation((event: string, cb: () => void) => {
        if (event === 'end') cb();
        return mockStream;
      }),
      destroy: jest.fn(),
    };
    const fs = require('fs');
    fs.createReadStream.mockReturnValue({ pipe: jest.fn().mockReturnValue(mockStream) });

    const result = await service.processEnquiry('Find me an iPhone');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(result).toBe('Here are 2 iPhones for you!');
  });

  // LLM requests the convertCurrencies tool and then responds
  it('should handle a convertCurrencies tool call and return the final answer', async () => {
    mockCreate
      .mockResolvedValueOnce(
        toolCallResponse('convertCurrencies', { amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }),
      )
      .mockResolvedValueOnce(textResponse('100 USD = 92.50 EUR'));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ rates: { USD: 1, EUR: 0.925 } }),
    });

    const result = await service.processEnquiry('Convert 100 USD to EUR');

    expect(result).toBe('100 USD = 92.50 EUR');
  });

  // OpenAI failure should throw InternalServerErrorException
  it('should throw InternalServerErrorException when OpenAI fails', async () => {
    mockCreate.mockRejectedValue(new Error('OpenAI unavailable'));

    await expect(service.processEnquiry('any')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
