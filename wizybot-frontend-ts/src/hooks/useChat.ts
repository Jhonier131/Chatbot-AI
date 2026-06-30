import { useState } from 'react';
import { sendMessageToApi } from '../services/api';
import type { Message, UseChatReturn } from '../types/chat';

/**
 * Custom hook to manage chat state and interactions.
 * Handles sending messages, receiving bot responses, and error states.
 */
export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Sends a message from the user and fetches the bot's response.
   * @param text - The user's input text.
   */
  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { id: Date.now(), text, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsLoading(true);

    try {
      // Fetch response from the API
      const botResponseText = await sendMessageToApi(text);

      // Clean up string if it comes with surrounding quotes from JSON serialization
      let parsedResponse: string = botResponseText;
      try {
        parsedResponse = JSON.parse(botResponseText) as string;
      } catch {
        // If it's not valid JSON (e.g. raw text or markdown), keep it as is
      }

      // Add bot response to the chat
      const botMessage: Message = {
        id: Date.now() + 1,
        text: parsedResponse,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Add an error message to the chat
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error while processing your request.',
        sender: 'bot',
        isError: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
