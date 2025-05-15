import express from 'express';
import {
  getOrders,
  getOrder,
  updateOrder,
  createOrder,
  trackOrder
} from '../controllers/orderController.js';
import { isAuthenticated, isAdmin, mockAdminAuth, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 開發環境中，使用模擬身份驗證
const authMiddleware = process.env.NODE_ENV === 'development' ? mockAdminAuth : isAuthenticated;
const adminMiddleware = process.env.NODE_ENV === 'development' ? mockAdminAuth : isAdmin;

// 獲取所有訂單 (需要管理員權限)
router.get('/', authMiddleware, adminMiddleware, getOrders);

// 訂單追蹤功能 (公開API，不需要身份驗證)
router.get('/track', trackOrder);

// 創建新訂單 (任何已驗證用戶)
router.post('/', authMiddleware, createOrder);

// 獲取特定訂單
router.get('/:orderId', authMiddleware, getOrder);

// 更新訂單狀態 (需要管理員權限)
router.put('/:orderId', authMiddleware, adminMiddleware, updateOrder);

export default router;
