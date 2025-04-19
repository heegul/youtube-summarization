import { Request, Response } from 'express';
import { extractVideoId, getVideoDetails, getVideoTranscript } from '../services/youtubeService';
import { getCache, setCache } from '../services/cacheService';
import { Video } from '../models/Video';
import { logger } from '../utils/logger';
import { summarizeText } from '../services/llmService';

/**
 * Get video details by URL or ID
 */
export const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    // Check if video exists in database
    let video = await Video.findOne({ youtubeId: videoId });
    
    if (!video) {
      // If not in database, fetch from YouTube API
      const videoDetails = await getVideoDetails(videoId);
      
      // Create new video record
      video = await Video.create({
        youtubeId: videoId,
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        thumbnailUrl: videoDetails.snippet.thumbnails.high.url,
        channelTitle: videoDetails.snippet.channelTitle,
        publishedAt: new Date(videoDetails.snippet.publishedAt),
        viewCount: videoDetails.statistics.viewCount,
        likeCount: videoDetails.statistics.likeCount,
        duration: videoDetails.contentDetails.duration,
      });
    }
    
    res.status(200).json(video);
  } catch (error: any) {
    logger.error('Error in getVideo controller:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch video details' });
  }
};

/**
 * Summarize a video
 */
export const summarizeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    // Check cache first
    const cacheKey = `summary:${videoId}`;
    const cachedSummary = await getCache<{ summary: string }>(cacheKey);
    
    if (cachedSummary) {
      logger.info(`Returning cached summary for video ${videoId}`);
      res.status(200).json(cachedSummary);
      return;
    }
    
    // Get video details
    let video = await Video.findOne({ youtubeId: videoId });
    
    if (!video) {
      // If not in database, fetch from YouTube API
      const videoDetails = await getVideoDetails(videoId);
      
      // Create new video record
      video = await Video.create({
        youtubeId: videoId,
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        thumbnailUrl: videoDetails.snippet.thumbnails.high.url,
        channelTitle: videoDetails.snippet.channelTitle,
        publishedAt: new Date(videoDetails.snippet.publishedAt),
        viewCount: videoDetails.statistics.viewCount,
        likeCount: videoDetails.statistics.likeCount,
        duration: videoDetails.contentDetails.duration,
      });
    }
    
    // Get transcript
    const transcript = await getVideoTranscript(videoId);
    
    // Get summary from LLM service
    const summary = await summarizeText(transcript, video.title);
    
    // Update video with summary
    video.summary = summary;
    await video.save();
    
    // Cache the result
    await setCache(cacheKey, { summary }, 86400); // Cache for 24 hours
    
    res.status(200).json({ summary });
  } catch (error: any) {
    logger.error('Error in summarizeVideo controller:', error);
    res.status(500).json({ error: error.message || 'Failed to summarize video' });
  }
};

/**
 * Search for videos
 */
export const searchVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    // Check cache first
    const cacheKey = `search:${query}`;
    const cachedResults = await getCache<any[]>(cacheKey);
    
    if (cachedResults) {
      logger.info(`Returning cached search results for query ${query}`);
      res.status(200).json(cachedResults);
      return;
    }
    
    // Search for videos using YouTube API
    const results = await searchVideos(query);
    
    // Cache the results
    await setCache(cacheKey, results, 3600); // Cache for 1 hour
    
    res.status(200).json(results);
  } catch (error: any) {
    logger.error('Error in searchVideos controller:', error);
    res.status(500).json({ error: error.message || 'Failed to search videos' });
  }
};
