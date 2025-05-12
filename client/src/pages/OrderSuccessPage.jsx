import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FiCheck, FiHome, FiFileText } from 'react-icons/fi';
import { getOrderById } from '../utils/orderUtils';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 從 localStorage 獲取最後一個訂單ID
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (!lastOrderId) {
      // 如果沒有訂單ID，返回首頁
      navigate('/');
      return;
    }

    // 獲取訂單詳情
    const orderDetails = getOrderById(lastOrderId);
    if (orderDetails) {
      setOrder(orderDetails);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 當沒有訂單資訊時顯示加載中
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiCheck className="text-green-500 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">訂單已成功送出！</h1>
            <p className="text-gray-600 mt-2">
              感謝您的訂購，我們已收到您的訂單，並將盡快處理。
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">訂單資訊</h2>
                <p className="text-gray-600 mt-1">訂單處理通知將發送至您的電子郵件。</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">訂單詳情</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">訂單編號:</span>
                    <span>{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">訂單日期:</span>
                    <span>{order.date.replace(/-/g, '/')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">付款方式:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  {order.deliveryMethod === 'delivery' ? '配送詳情' : '取貨詳情'}
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {order.deliveryMethod === 'delivery' ? '預計配送日期:' : '預計取貨日期:'}
                    </span>
                    <span>{order.deliveryDate.replace(/-/g, '/')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">時間段:</span>
                    <span>{order.deliveryTime.replace('-', ' - ')}</span>
                  </div>
                  {order.deliveryMethod === 'pickup' && order.store && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">取貨門市:</span>
                      <span>{order.store.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiFileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    訂單確認郵件已發送至您的電子信箱，您可以隨時在「我的訂單」中查看訂單狀態。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/profile', { state: { activeSection: 'orders' } })}
                className="px-6 py-2 border border-[#5a6440] text-[#5a6440] rounded-md hover:bg-[#f7f5f0] transition duration-200 flex items-center justify-center"
              >
                <FiFileText className="mr-2" /> 查看我的訂單
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-[#5a6440] text-white rounded-md hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
              >
                <FiHome className="mr-2" /> 返回首頁
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
