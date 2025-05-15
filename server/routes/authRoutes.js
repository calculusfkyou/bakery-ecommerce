import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/authController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { upload } from '../config/uploadConfig.js';

const router = express.Router();

// 公開路由
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// 受保護路由 - 需要登入
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// 會員管理路由 (需要管理員權限)
router.get('/users', protect, restrictTo('admin', 'manager'), getAllUsers);
router.get('/users/:id', protect, restrictTo('admin', 'manager'), getUser);
router.post('/users', protect, restrictTo('admin'), createUser);
router.put('/users/:id', protect, restrictTo('admin'), updateUser);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

export default router;
