// This file contains functions to interact with the API.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

export const sendMessageToApi = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // The API responds with a raw string (which could be wrapped in quotes if it's raw JSON,
    // or just plain text depending on how NestJS serializes it). 
    // .text() is safer here to capture the raw response.
    const data = await response.text();
    
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
