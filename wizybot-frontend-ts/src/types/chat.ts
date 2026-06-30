// Types for the chat domain

/**
 * Represents a single message in the chat conversation.
 */
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
}

/**
 * Return type of the useChat hook.
 */
export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
}
