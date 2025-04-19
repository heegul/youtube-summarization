import { extractVideoId, getVideoDetails } from '../services/youtubeService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YouTube Service', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from shortened YouTube URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from embedded YouTube URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid YouTube URL', () => {
      const url = 'https://example.com';
      expect(extractVideoId(url)).toBeNull();
    });
  });

  describe('getVideoDetails', () => {
    it('should fetch video details successfully', async () => {
      // Mock environment variable
      process.env.YOUTUBE_API_KEY = 'test-api-key';

      // Mock successful API response
      const mockResponse = {
        data: {
          items: [
            {
              id: 'test-video-id',
              snippet: {
                title: 'Test Video Title',
                description: 'Test video description',
                thumbnails: {
                  high: {
                    url: 'https://example.com/thumbnail.jpg',
                  },
                },
                channelTitle: 'Test Channel',
                publishedAt: '2023-01-01T00:00:00Z',
              },
              contentDetails: {
                duration: 'PT5M30S',
              },
              statistics: {
                viewCount: '1000',
                likeCount: '100',
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getVideoDetails('test-video-id');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/youtube/v3/videos',
        expect.objectContaining({
          params: expect.objectContaining({
            id: 'test-video-id',
            key: 'test-api-key',
          }),
        })
      );

      expect(result).toEqual(mockResponse.data.items[0]);
    });

    it('should throw an error when video is not found', async () => {
      // Mock environment variable
      process.env.YOUTUBE_API_KEY = 'test-api-key';

      // Mock empty response
      const mockResponse = {
        data: {
          items: [],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await expect(getVideoDetails('non-existent-id')).rejects.toThrow(
        'Video with ID non-existent-id not found'
      );
    });

    it('should throw an error when API key is missing', async () => {
      // Remove API key from environment
      delete process.env.YOUTUBE_API_KEY;

      await expect(getVideoDetails('test-video-id')).rejects.toThrow(
        'YouTube API key is not configured'
      );
    });
  });
});
