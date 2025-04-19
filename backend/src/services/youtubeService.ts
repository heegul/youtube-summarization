import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Extract YouTube video ID from URL
 */
export const extractVideoId = (url: string): string | null => {
  // Regular expression to match YouTube video ID from different URL formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const match = url.match(regex);
  
  return match ? match[1] : null;
};

/**
 * Get details of a YouTube video
 */
export const getVideoDetails = async (videoId: string): Promise<any> => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }
    
    logger.info(`Fetching details for video: ${videoId}`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: apiKey,
      },
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error(`Video with ID ${videoId} not found`);
    }
    
    return response.data.items[0];
  } catch (error) {
    logger.error(`Error fetching video details for ${videoId}:`, error);
    throw error;
  }
};

/**
 * Get transcript of a YouTube video
 * Note: For actual implementation, you might need to use a third-party library
 * like youtube-transcript or implement OAuth 2.0 authentication for YouTube Data API
 */
export const getVideoTranscript = async (videoId: string): Promise<string> => {
  try {
    // This is a placeholder - in a real implementation, you'd use a library like youtube-transcript
    // or implement OAuth 2.0 authentication for YouTube Data API
    logger.info(`Fetching transcript for video: ${videoId}`);
    
    // Simulated transcript for demo purposes
    // In real implementation, replace with actual API call
    const simulatedTranscript = `This is a simulated transcript for video ${videoId}. `;
    return simulatedTranscript;
  } catch (error) {
    logger.error(`Error fetching video transcript for ${videoId}:`, error);
    throw error;
  }
};

/**
 * Search for YouTube videos
 */
export const searchVideos = async (query: string, maxResults: number = 10): Promise<any[]> => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }
    
    logger.info(`Searching for videos with query: ${query}`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: apiKey,
      },
    });
    
    return response.data.items || [];
  } catch (error) {
    logger.error(`Error searching videos with query ${query}:`, error);
    throw error;
  }
};
