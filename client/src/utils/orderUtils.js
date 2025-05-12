// 獲取所有訂單
export const getOrders = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : getInitialOrders();
};

// 添加新訂單
export const addOrder = (newOrder) => {
  const orders = getOrders();
  const updatedOrders = [newOrder, ...orders];
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  return updatedOrders;
};

// 獲取指定ID的訂單
export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// 初始訂單數據 (烘焙店相關)
const getInitialOrders = () => {
  const initialOrders = [
    {
      id: 'ORD-20250510-001',
      orderNumber: 'ORD-20250510-001',
      date: '2025-05-10',
      status: '已完成',
      totalAmount: 1280,
      paymentMethod: '信用卡付款',
      deliveryMethod: 'delivery',
      deliveryInfo: {
        name: '王小明',
        phone: '0912-345-678',
        email: 'ming@example.com',
        address: '台北市信義區信義路5段100號',
        postalCode: '110',
        city: '台北市'
      },
      deliveryDate: '2025-05-12',
      deliveryTime: '09:00-11:00',
      items: [
        { id: 303, name: '檸檬乳酪蛋糕', size: '8吋', flavor: '原味', decoration: '檸檬片', quantity: 1, price: 780 },
        { id: 302, name: '巧克力慕斯蛋糕', size: '6吋', flavor: '黑巧克力', decoration: '巧克力碎片', quantity: 1, price: 620 }
      ],
      store: null
    },
    {
      id: 'ORD-20250502-042',
      orderNumber: 'ORD-20250502-042',
      date: '2025-05-02',
      status: '已完成',
      totalAmount: 650,
      paymentMethod: 'LINE Pay',
      deliveryMethod: 'pickup',
      deliveryInfo: null,
      pickupInfo: {
        name: '李小花',
        phone: '0923-456-789',
        email: 'flower@example.com',
        store: '1'
      },
      deliveryDate: '2025-05-05',
      deliveryTime: '13:00-15:00',
      items: [
        { id: 304, name: '荔枝玫瑰蛋糕', size: '6吋', flavor: '原味', decoration: '玫瑰花瓣', quantity: 1, price: 650 }
      ],
      store: {
        id: 1,
        name: '台北信義門市',
        address: '台北市信義區信義路5段7號'
      }
    }
  ];

  localStorage.setItem('orders', JSON.stringify(initialOrders));
  return initialOrders;
};
