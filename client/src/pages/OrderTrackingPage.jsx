import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiClock, FiCheckCircle, FiTruck, FiHome } from 'react-icons/fi';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import axios from 'axios';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingFormVisible, setTrackingFormVisible] = useState(!orderId);
  const [orderNumber, setOrderNumber] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      // 使用公開的訂單追蹤路由 /track 而不是需要身份驗證的 /:orderId 路由
      const response = await axios.get('http://localhost:5000/api/orders/track', {
        params: {
          orderNumber: id
        }
      });
      setOrder(response.data);
      setTrackingFormVisible(false);
    } catch (err) {
      console.error('獲取訂單詳情失敗:', err);
      setError('無法找到此訂單，請確認訂單編號是否正確。');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      alert('請輸入訂單編號');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 直接查詢
      await fetchOrderDetails(orderNumber);

      // 如果查詢成功，更新 URL 以便於分享
      if (!error) {
        navigate(`/order-tracking/${orderNumber}`);
      }
    } catch (err) {
      console.error('查詢訂單失敗:', err);
      setError('找不到符合的訂單，請確認訂單編號是否正確。');
      setLoading(false);
    }
  };

  // 根據狀態返回進度條的寬度百分比
  const getProgressWidth = (status) => {
    switch (status) {
      case '待處理':
        return '25%';
      case '製作中':
        return '50%';
      case '待配送/取貨':
        return '75%';
      case '已完成':
        return '100%';
      case '已取消':
        return '100%';
      default:
        return '0%';
    }
  };

  // 格式化時間
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 根據狀態顯示不同背景色
  const getStatusColor = (status) => {
    switch (status) {
      case '待處理':
        return 'bg-blue-100 text-blue-800';
      case '製作中':
        return 'bg-yellow-100 text-yellow-800';
      case '待配送/取貨':
        return 'bg-purple-100 text-purple-800';
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '已取消':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 獲取狀態圖標
  const getStatusIcon = (status) => {
    switch (status) {
      case '待處理':
        return <FiClock className="text-blue-500" />;
      case '製作中':
        return <FiPackage className="text-yellow-500" />;
      case '待配送/取貨':
        return <FiTruck className="text-purple-500" />;
      case '已完成':
        return <FiCheckCircle className="text-green-500" />;
      case '已取消':
        return <FiHome className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#5a6440] pb-2 inline-block">訂單追蹤</h1>

          {/* 訂單查詢表單 */}
          {trackingFormVisible && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">查詢您的訂單</h2>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

              <form onSubmit={handleOrderSearch}>
                <div className="mb-4">
                  <label htmlFor="orderNumber" className="block text-gray-700 mb-2">訂單編號 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="例如: ORD-20250510-001"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contactInfo" className="block text-gray-700 mb-2">聯絡電話/Email</label>
                  <input
                    type="text"
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="請輸入下單時的聯絡電話或Email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#5a6440] text-white rounded-md hover:bg-[#47512f] transition duration-200"
                  disabled={loading}
                >
                  {loading ? '查詢中...' : '查詢訂單'}
                </button>
              </form>
            </div>
          )}

          {/* 訂單資訊 */}
          {order && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 訂單頭部 */}
              <div className="bg-[#5a6440] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">訂單編號: {order.orderNumber}</h2>
                  <p className="text-sm opacity-90">下單日期: {order.date}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white ${order.status === '已取消' ? 'text-red-700' : 'text-[#5a6440]'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* 最後更新時間 */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="bg-gray-50 p-3 border-b text-sm text-gray-600">
                  最後更新時間: {formatDateTime(order.statusHistory[0].timestamp)}
                </div>
              )}

              {/* 訂單進度追蹤 */}
              {order.status !== '已取消' && (
                <div className="p-4 border-b">
                  <div className="mb-2 flex justify-between text-sm text-gray-600">
                    <span>訂單確認</span>
                    <span>製作中</span>
                    <span>準備出貨</span>
                    <span>已完成</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5a6440]"
                      style={{ width: getProgressWidth(order.status) }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-[#5a6440] font-medium">
                    {order.status === '已完成'
                      ? '您的訂單已完成！感謝您的惠顧。'
                      : order.status === '待配送/取貨'
                        ? order.deliveryMethod === 'delivery'
                          ? '您的訂單已準備完成，即將安排配送。'
                          : '您的訂單已準備完成，可以前來取貨了。'
                        : '我們正在為您處理訂單。'}
                  </div>
                </div>
              )}

              {/* 訂單明細 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">訂單明細</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{item.name} x{item.quantity}</p>
                        {(item.size || item.flavor || item.decoration) && (
                          <p className="text-xs text-gray-600">
                            {item.size && `尺寸: ${item.size}`}
                            {item.flavor && ` | 口味: ${item.flavor}`}
                            {item.decoration && ` | 裝飾: ${item.decoration}`}
                          </p>
                        )}
                      </div>
                      <div className="text-gray-700">
                        NT${(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-semibold">
                    <span>總計</span>
                    <span className="text-red-600">NT${order.totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* 配送/取貨資訊 */}
              <div className="p-4 bg-gray-50 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {order.deliveryMethod === 'delivery' ? '配送資訊' : '自取資訊'}
                </h3>
                {order.deliveryMethod === 'delivery' ? (
                  <div className="space-y-2 text-sm">
                    <p>收件人: {order.deliveryInfo.name}</p>
                    <p>聯絡電話: {order.deliveryInfo.phone}</p>
                    <p>配送地址: {order.deliveryInfo.address}</p>
                    <p>預計配送日期: {order.deliveryDate}</p>
                    <p>配送時段: {order.deliveryTime}</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p>取貨人: {order.pickupInfo.name}</p>
                    <p>聯絡電話: {order.pickupInfo.phone}</p>
                    <p>自取門市: {order.store ? order.store.name : '總店'}</p>
                    <p>門市地址: {order.store ? order.store.address : '台北市大安區和平東路二段106號'}</p>
                    <p>預計取貨日期: {order.deliveryDate}</p>
                    <p>取貨時段: {order.deliveryTime}</p>
                  </div>
                )}
              </div>

              {/* 訂單歷程 */}
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">訂單處理歷程</h3>
                <div className="space-y-4">
                  {order.statusHistory && order.statusHistory.map((history, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {getStatusIcon(history.status)}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{history.status}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(history.timestamp)}</p>
                        {history.note && <p className="text-sm text-gray-700 mt-1">{history.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 返回按鈕 */}
              <div className="p-4 border-t text-center">
                <Link to="/" className="text-[#5a6440] hover:underline font-medium">
                  <FiArrowLeft className="inline mr-1" /> 返回首頁
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
