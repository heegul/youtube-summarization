import express, { RequestHandler } from 'express';
import { getUserProfile, createUser, updateUserProfile } from '../controllers/userController';

const router = express.Router();

// Get user profile
router.get('/:userId', getUserProfile as RequestHandler);

// Create new user
router.post('/', createUser as RequestHandler);

// Update user profile
router.put('/:userId', updateUserProfile as RequestHandler);

export default router;
