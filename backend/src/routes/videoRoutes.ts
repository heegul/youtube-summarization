import express, { RequestHandler } from 'express';
import { getVideo, summarizeVideo, searchVideos } from '../controllers/videoController';

const router = express.Router();

// Get video details by ID
router.get('/:videoId', getVideo as RequestHandler);

// Summarize video
router.get('/summary/:videoId', summarizeVideo as RequestHandler);

// Search videos
router.get('/search', searchVideos as RequestHandler);

export default router;
