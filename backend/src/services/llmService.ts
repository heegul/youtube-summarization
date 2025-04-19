import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Summarize text using LLM
 */
export const summarizeText = async (text: string, title: string): Promise<string> => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    logger.info(`Summarizing text for video: ${title}`);
    
    // For demo purposes, we'll use OpenAI's API
    // In production, you might want to use a more specialized API or model
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes YouTube video transcripts.'
          },
          {
            role: 'user',
            content: `Summarize the following transcript of a YouTube video titled "${title}": ${text}`
          }
        ],
        max_tokens: 500,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    logger.error('Error in LLM service:', error);
    throw new Error('Failed to generate summary using LLM');
  }
};
