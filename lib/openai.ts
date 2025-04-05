import OpenAI from 'openai';

// Check if the API key is set and has the correct format
if (!process.env.OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY environment variable');
} else if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.warn('Invalid OPENAI_API_KEY format. API key should start with "sk-"');
}

// Default model to use
export const DEFAULT_MODEL = 'gpt-3.5-turbo';

// Types for chat responses
export interface ChatCompletionChunk {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// We no longer export the client instance from here
// export { OpenAI }; // Optionally re-export the class if needed elsewhere, but avoid instance 