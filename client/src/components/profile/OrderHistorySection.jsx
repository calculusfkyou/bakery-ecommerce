import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPackage, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { getOrders } from '../../utils/orderUtils'; // 引入訂單工具函數

export default function OrderHistorySection({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // 從 localStorage 獲取訂單數據
  useEffect(() => {
    try {
      // 使用 getOrders 函數獲取訂單數據
      const userOrders = getOrders();
      setOrders(userOrders);
      setLoading(false);
    } catch (err) {
      console.error('獲取訂單資料錯誤:', err);
      setError('無法載入訂單資料');
      setLoading(false);
    }
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="text-center py-8">載入訂單記錄中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">訂單記錄</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          您還沒有任何訂單記錄
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div
                className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {order.date.replace(/-/g, '/')} | {order.deliveryMethod === 'delivery' ? '宅配到府' : '門市自取'}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === '已完成' ? 'bg-green-100 text-green-700' :
                    order.status === '處理中' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <p className="ml-4 font-medium">NT$ {order.totalAmount}</p>
                  {expandedOrderId === order.id ?
                    <FiChevronUp className="ml-2 w-5 h-5" /> :
                    <FiChevronDown className="ml-2 w-5 h-5" />
                  }
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="p-4 border-t">
                  {/* 配送/取貨資訊 */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium flex items-center mb-2">
                      <FiMapPin className="mr-2 text-[#5a6440]" />
                      {order.deliveryMethod === 'delivery' ? '配送資訊' : '取貨資訊'}
                    </h4>
                    {order.deliveryMethod === 'delivery' ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">收件人</p>
                          <p>{order.deliveryInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">聯絡電話</p>
                          <p>{order.deliveryInfo.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">配送地址</p>
                          <p>{`${order.deliveryInfo.postalCode} ${order.deliveryInfo.city} ${order.deliveryInfo.address}`}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">取貨人</p>
                          <p>{order.pickupInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">聯絡電話</p>
                          <p>{order.pickupInfo.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">取貨門市</p>
                          <p>{order.store?.name}</p>
                          <p className="text-sm text-gray-500">{order.store?.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 配送時間 */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium flex items-center mb-2">
                      <FiCalendar className="mr-2 text-[#5a6440]" />
                      {order.deliveryMethod === 'delivery' ? '配送時間' : '取貨時間'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">日期</p>
                        <p>{order.deliveryDate.replace(/-/g, '/')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">時間段</p>
                        <p>{order.deliveryTime.replace('-', ' - ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* 付款資訊 */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium flex items-center mb-2">
                      <FiCreditCard className="mr-2 text-[#5a6440]" />
                      付款資訊
                    </h4>
                    <p className="text-sm">{order.paymentMethod}</p>
                  </div>

                  {/* 訂購項目 */}
                  <h4 className="font-medium flex items-center mb-2">
                    <FiPackage className="mr-2 text-[#5a6440]" /> 訂購商品
                  </h4>
                  <div className="divide-y divide-gray-200 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.size && <span className="inline-block mr-2">尺寸: {item.size}</span>}
                            {item.flavor && <span className="inline-block mr-2">口味: {item.flavor}</span>}
                            {item.decoration && <span className="inline-block">裝飾: {item.decoration}</span>}
                          </div>
                          {item.message && (
                            <p className="text-xs text-gray-500 mt-1 italic">「{item.message}」</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {item.quantity} x NT$ {item.price}
                          </p>
                          <p className="font-medium">
                            NT$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <p className="font-medium">訂單總計</p>
                    <p className="font-bold text-[#5a6440] text-lg">
                      NT$ {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
