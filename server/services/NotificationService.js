/**
 * 通知服務 - 處理各種系統通知和用戶提醒
 */
class NotificationService {
  /**
   * 發送訂單狀態更新通知
   * @param {Object} order - 訂單對象
   * @param {string} previousStatus - 之前的狀態
   */
  static async sendOrderStatusUpdateNotification(order, previousStatus) {
    try {
      // 獲取用戶聯絡資訊
      const contactInfo = order.deliveryMethod === 'delivery'
        ? order.deliveryInfo
        : order.pickupInfo;

      // 根據訂單狀態定製訊息
      let message = '';
      switch (order.status) {
        case '待處理':
          message = `您的訂單 #${order.orderNumber} 已收到，正在準備處理。`;
          break;
        case '製作中':
          message = `您的訂單 #${order.orderNumber} 已開始製作，我們將盡快為您準備。`;
          break;
        case '待配送/取貨':
          message = order.deliveryMethod === 'delivery'
            ? `您的訂單 #${order.orderNumber} 已準備完成，即將安排配送。`
            : `您的訂單 #${order.orderNumber} 已準備完成，可以前來取貨了。`;
          break;
        case '已完成':
          message = `您的訂單 #${order.orderNumber} 已完成，感謝您的惠顧！`;
          break;
        case '已取消':
          message = `您的訂單 #${order.orderNumber} 已取消。如有疑問，請聯繫客服。`;
          break;
        default:
          message = `您的訂單 #${order.orderNumber} 狀態已更新。`;
      }

      // 在實際環境中，這裡會調用真實的通知服務
      // 如寄送 Email、SMS、或 App 推播通知
      console.log(`[通知服務] 給 ${contactInfo.name} 發送訂單狀態更新通知：`, message);

      // 記錄通知
      return {
        success: true,
        message: `通知已發送給 ${contactInfo.name}`,
        timestamp: new Date().toISOString(),
        notificationType: 'orderStatusUpdate',
        recipient: contactInfo,
        orderNumber: order.orderNumber,
        content: message
      };

    } catch (error) {
      console.error('[通知服務] 發送訂單狀態更新通知失敗', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default NotificationService;
