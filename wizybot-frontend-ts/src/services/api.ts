// This file contains functions to interact with the API.

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3100';

/**
 * Sends a user prompt to the chat API and returns the raw response text.
 * @param prompt - The user's message to send to the API.
 * @returns The raw response string from the API.
 * @throws Will throw an error if the network request fails or the API returns a non-OK status.
 */
export const sendMessageToApi = async (prompt: string): Promise<string> => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // The API responds with a raw string (which could be wrapped in quotes if it's raw JSON,
  // or just plain text depending on how NestJS serializes it).
  // .text() is safer here to capture the raw response.
  const data = await response.text();

  return data;
};
