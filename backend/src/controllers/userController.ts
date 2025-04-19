import { Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    logger.error('Error in getUserProfile controller:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
  }
};

/**
 * Create new user
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, hash the password before saving
    });
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    logger.error('Error in createUser controller:', error);
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    logger.error('Error in updateUserProfile controller:', error);
    res.status(500).json({ error: error.message || 'Failed to update user profile' });
  }
};
