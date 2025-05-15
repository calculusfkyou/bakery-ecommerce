import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  addOrder,
  ORDER_STATUS
} from '../models/orderModel.js';
import NotificationService from '../services/NotificationService.js';

// 獲取所有訂單
export const getOrders = (req, res) => {
  try {
    const orders = getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: '獲取訂單失敗', error: error.message });
  }
};

// 獲取特定訂單
export const getOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: '訂單不存在' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: '獲取訂單失敗', error: error.message });
  }
};

// 更新訂單狀態
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ message: '無效的訂單狀態' });
    }

    // 獲取更新前的訂單狀態
    const existingOrder = getOrderById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: '訂單不存在' });
    }

    const previousStatus = existingOrder.status;

    // 更新訂單狀態
    const updatedOrder = updateOrderStatus(orderId, status, note);

    // 如果狀態有變化，發送通知
    let notificationResult = null;
    if (previousStatus !== status) {
      notificationResult = await NotificationService.sendOrderStatusUpdateNotification(updatedOrder, previousStatus);
    }

    res.status(200).json({
      message: '訂單狀態已更新',
      order: updatedOrder,
      notification: notificationResult
    });
  } catch (error) {
    res.status(500).json({ message: '更新訂單狀態失敗', error: error.message });
  }
};

// 創建新訂單
export const createOrder = (req, res) => {
  try {
    const orderData = req.body;

    // 基本驗證
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: '訂單必須包含商品項目' });
    }

    const newOrder = addOrder(orderData);

    res.status(201).json({
      message: '訂單已成功創建',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: '創建訂單失敗', error: error.message });
  }
};

// 根據訂單編號和聯絡資訊查詢訂單 (供前台客戶查詢)
export const trackOrder = (req, res) => {
  try {
    const { orderNumber, contactInfo } = req.query;

    if (!orderNumber) {
      return res.status(400).json({ message: '請提供訂單編號' });
    }

    const orders = getAllOrders();

    // 查找符合條件的訂單
    const order = orders.find(order => {
      const matchOrderNumber = order.orderNumber === orderNumber;

      // 如果提供了聯絡資訊，則進一步驗證
      if (contactInfo) {
        const customerInfo = order.deliveryMethod === 'delivery' ? order.deliveryInfo : order.pickupInfo;

        return matchOrderNumber && (
          customerInfo.phone === contactInfo ||
          customerInfo.email === contactInfo ||
          customerInfo.name === contactInfo
        );
      }

      return matchOrderNumber;
    });

    if (!order) {
      return res.status(404).json({ message: '找不到符合條件的訂單' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: '查詢訂單失敗', error: error.message });
  }
};
