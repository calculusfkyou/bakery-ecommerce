// 訂單狀態常量
export const ORDER_STATUS = {
  PENDING: '待處理',
  PROCESSING: '製作中',
  READY: '待配送/取貨',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
};

// 訂單模擬數據
export const orders = [
  {
    id: 'ORD-20250510-001',
    orderNumber: 'ORD-20250510-001',
    date: '2025-05-10',
    status: ORDER_STATUS.COMPLETED,
    totalAmount: 1280,
    paymentMethod: '信用卡付款',
    deliveryMethod: 'delivery',
    deliveryInfo: {
      name: '王小明',
      phone: '0912345678',
      address: '台北市大安區忠孝東路四段2號5樓'
    },
    pickupInfo: null,
    deliveryDate: '2025-05-12',
    deliveryTime: '13:00-15:00',
    items: [
      { id: 102, name: '法式巧克力可頌', quantity: 2, price: 55 },
      { id: 302, name: '巧克力慕斯蛋糕', size: '6吋', flavor: '黑巧克力', decoration: '巧克力碎片', quantity: 1, price: 620 }
    ],
    store: null,
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: '2025-05-10T09:15:23', note: '訂單已收到' },
      { status: ORDER_STATUS.PROCESSING, timestamp: '2025-05-10T10:20:45', note: '開始製作' },
      { status: ORDER_STATUS.READY, timestamp: '2025-05-11T14:30:12', note: '製作完成，準備出貨' },
      { status: ORDER_STATUS.COMPLETED, timestamp: '2025-05-12T14:45:02', note: '已送達客戶' }
    ],
    customerNote: '請提供環保購物袋'
  },
  {
    id: 'ORD-20250508-002',
    orderNumber: 'ORD-20250508-002',
    date: '2025-05-08',
    status: ORDER_STATUS.READY,
    totalAmount: 650,
    paymentMethod: 'LINE Pay',
    deliveryMethod: 'pickup',
    deliveryInfo: null,
    pickupInfo: {
      name: '李小花',
      phone: '0923456789',
      email: 'flower@example.com',
      store: '1'
    },
    deliveryDate: '2025-05-10',
    deliveryTime: '10:00-12:00',
    items: [
      { id: 304, name: '荔枝玫瑰蛋糕', size: '6吋', flavor: '原味', decoration: '玫瑰花瓣', quantity: 1, price: 650 }
    ],
    store: {
      id: 1,
      name: '台北信義門市',
      address: '台北市信義區信義路5段7號'
    },
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: '2025-05-08T15:30:23', note: '訂單已收到' },
      { status: ORDER_STATUS.PROCESSING, timestamp: '2025-05-09T09:15:40', note: '開始製作' },
      { status: ORDER_STATUS.READY, timestamp: '2025-05-09T16:20:12', note: '製作完成，可來店取貨' }
    ],
    customerNote: '需要插上生日蠟燭'
  },
  {
    id: 'ORD-20250515-003',
    orderNumber: 'ORD-20250515-003',
    date: '2025-05-15',
    status: ORDER_STATUS.PENDING,
    totalAmount: 480,
    paymentMethod: '貨到付款',
    deliveryMethod: 'delivery',
    deliveryInfo: {
      name: '陳大同',
      phone: '0934567890',
      address: '台北市中山區民生東路一段10號3樓'
    },
    pickupInfo: null,
    deliveryDate: '2025-05-17',
    deliveryTime: '16:00-18:00',
    items: [
      { id: 201, name: '原味可頌', quantity: 4, price: 45 },
      { id: 204, name: '法國長棍麵包', quantity: 2, price: 40 },
      { id: 205, name: '歐式核桃麵包', quantity: 3, price: 65 }
    ],
    store: null,
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: '2025-05-15T10:45:23', note: '訂單已收到' }
    ],
    customerNote: ''
  },
  // 新增「製作中」狀態的訂單
  {
    id: 'ORD-20250516-004',
    orderNumber: 'ORD-20250516-004',
    date: '2025-05-16',
    status: ORDER_STATUS.PROCESSING,
    totalAmount: 1850,
    paymentMethod: '信用卡付款',
    deliveryMethod: 'delivery',
    deliveryInfo: {
      name: '張小琳',
      phone: '0987654321',
      address: '台北市松山區南京東路五段123號7樓'
    },
    pickupInfo: null,
    deliveryDate: '2025-05-18',
    deliveryTime: '09:00-12:00',
    items: [
      { id: 305, name: '水果生日蛋糕', size: '8吋', flavor: '香草', decoration: '新鮮水果', quantity: 1, price: 980 },
      { id: 203, name: '法國鄉村麵包', quantity: 2, price: 85 },
      { id: 106, name: '肉桂捲', quantity: 6, price: 45 },
      { id: 108, name: '抹茶紅豆貝果', quantity: 3, price: 70 }
    ],
    store: null,
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: '2025-05-16T08:25:30', note: '訂單已收到' },
      { status: ORDER_STATUS.PROCESSING, timestamp: '2025-05-16T10:45:12', note: '蛋糕已開始製作，預計需要4小時完成' }
    ],
    customerNote: '蛋糕請寫上「生日快樂，琪琪！」'
  },
  // 新增「已取消」狀態的訂單
  {
    id: 'ORD-20250514-005',
    orderNumber: 'ORD-20250514-005',
    date: '2025-05-14',
    status: ORDER_STATUS.CANCELLED,
    totalAmount: 560,
    paymentMethod: 'LINE Pay',
    deliveryMethod: 'pickup',
    deliveryInfo: null,
    pickupInfo: {
      name: '林小豪',
      phone: '0976543210',
      email: 'lin@example.com',
      store: '2'
    },
    deliveryDate: '2025-05-16',
    deliveryTime: '14:00-17:00',
    items: [
      { id: 301, name: '草莓鮮奶油蛋糕', size: '6吋', flavor: '原味', decoration: '草莓裝飾', quantity: 1, price: 560 }
    ],
    store: {
      id: 2,
      name: '台北中山門市',
      address: '台北市中山區中山北路二段45號'
    },
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: '2025-05-14T15:30:20', note: '訂單已收到' },
      { status: ORDER_STATUS.CANCELLED, timestamp: '2025-05-15T09:40:15', note: '客戶臨時取消訂單，已退款完成' }
    ],
    customerNote: '希望蛋糕上有巧克力碎片'
  }
];

// 獲取所有訂單
export const getAllOrders = () => {
  return orders;
};

// 獲取特定訂單
export const getOrderById = (orderId) => {
  return orders.find(order => order.id === orderId);
};

// 更新訂單狀態
export const updateOrderStatus = (orderId, newStatus, note = '') => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  order.status = newStatus;

  // 添加到狀態歷史
  const timestamp = new Date().toISOString();
  order.statusHistory.push({
    status: newStatus,
    timestamp,
    note: note || `狀態已更新為${newStatus}`
  });

  orders[orderIndex] = order;
  return order;
};

// 添加新訂單
export const addOrder = (orderData) => {
  const newOrder = {
    ...orderData,
    id: orderData.id || `ORD-${Date.now()}`,
    orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
    statusHistory: orderData.statusHistory || [
      { status: ORDER_STATUS.PENDING, timestamp: new Date().toISOString(), note: '訂單已收到' }
    ]
  };

  orders.unshift(newOrder);
  return newOrder;
};
