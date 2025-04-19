import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { logger } from './utils/logger';
import videoRoutes from './routes/videoRoutes';
import userRoutes from './routes/userRoutes';
import { initRedisClient } from './services/cacheService';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-summarization')
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Initialize Redis client
initRedisClient()
  .then(() => {
    logger.info('Connected to Redis');
  })
  .catch((error) => {
    logger.error('Redis connection error:', error);
    // Continue even if Redis fails to connect
  });

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
