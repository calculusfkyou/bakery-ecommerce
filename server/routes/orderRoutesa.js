import express from 'express';
import {
  getOrders,
  getOrder,
  updateOrder,
  createOrder,
  trackOrder
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ 所有訂單：需要登入 + admin
router.get('/', protect, restrictTo('admin'), getOrders);

// ✅ 公開：訂單追蹤
router.get('/track', trackOrder);

// ✅ 建立訂單：只要登入即可
router.post('/', protect, createOrder);

// ✅ 查看訂單：只要登入即可
router.get('/:orderId', protect, getOrder);

// ✅ 更新訂單：僅 admin 可改
router.put('/:orderId', protect, restrictTo('admin'), updateOrder);

export default router;
