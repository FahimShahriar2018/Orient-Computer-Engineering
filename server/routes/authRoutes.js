import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router.route('/users').get(protect, admin, getUsers);

export default router;
