import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FiShoppingBag, FiArrowRight, FiTrash, FiPlus, FiMinus } from 'react-icons/fi';

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const isFirstRender = useRef(true);  // 新增: 追蹤是否為首次渲染

  // 從 localStorage 獲取購物車資料
  useEffect(() => {
    console.log('載入購物車資料:', localStorage.getItem('cart'));
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, [location]);

  // 當購物車項目變更時，計算總價和更新本地存儲
  useEffect(() => {
    // 計算總價
    const newTotalPrice = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    setTotalPrice(newTotalPrice);

    // 僅在非首次渲染時更新 localStorage
    if (!isFirstRender.current) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      isFirstRender.current = false;
    }
  }, [cartItems]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  // 增加商品數量
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // 減少商品數量
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // 從購物車中移除商品
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // 清空購物車
  const clearCart = () => {
    if (window.confirm('確定要清空購物車嗎？')) {
      setCartItems([]);
    }
  };

  // 結帳功能
  const checkout = () => {
    // 檢查購物車是否有商品
    if (cartItems.length === 0) {
      alert('購物車是空的，請先添加商品');
      return;
    }

    // 導航到結帳頁面
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">購物車</h1>

        {cartItems.length === 0 ? (
          // 空購物車的顯示
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <FiShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">您的購物車是空的</h2>
            <p className="text-gray-600 mb-6">看起來您還沒有添加任何商品到購物車</p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#5a6440] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-200 flex items-center justify-center mx-auto"
            >
              前往選購商品
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        ) : (
          // 顯示購物車內容
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 購物車頭部 */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700">購物明細</h2>
              <button
                onClick={clearCart}
                className="flex items-center text-red-500 hover:text-red-700"
              >
                <FiTrash className="mr-1" /> 清空購物車
              </button>
            </div>

            {/* 購物車項目列表 */}
            <div className="mt-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200"
                >
                  {/* 商品圖片 */}
                  <div className="w-24 h-24 flex-shrink-0 mr-4 mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* 商品資訊 */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.customOptions?.size && (
                        <span className="mr-2">尺寸: {item.customOptions.size}</span>
                      )}
                      {item.customOptions?.flavor && (
                        <span className="mr-2">口味: {item.customOptions.flavor}</span>
                      )}
                      {item.customOptions?.decoration && (
                        <span>裝飾: {item.customOptions.decoration}</span>
                      )}
                    </div>
                    {item.customOptions?.message && (
                      <div className="text-sm text-gray-600 mt-1">
                        <span>客製化訊息: {item.customOptions.message}</span>
                      </div>
                    )}
                    <div className="text-sm font-medium text-[#5a6440] mt-1">
                      單價: ${item.price}
                    </div>
                  </div>

                  {/* 數量控制 */}
                  <div className="flex items-center mt-4 sm:mt-0">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                    >
                      <FiMinus className="text-gray-500" />
                    </button>
                    <span className="px-3 py-1 border-t border-b border-gray-300 bg-white text-center w-10">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    >
                      <FiPlus className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash />
                    </button>
                  </div>

                  {/* 項目總價 */}
                  <div className="font-bold text-lg text-gray-800 ml-4 mt-4 sm:mt-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* 購物車摘要 */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">小計</span>
                <span className="text-lg font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">運費</span>
                <span className="text-lg font-bold text-gray-800">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xl font-semibold text-gray-800">總計</span>
                <span className="text-xl font-bold text-[#5a6440]">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* 結帳按鈕 */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <button
                onClick={handleContinueShopping}
                className="w-full sm:w-auto mb-4 sm:mb-0 px-6 py-3 border border-[#5a6440] text-[#5a6440] rounded-md hover:bg-[#f7f5f0] transition duration-200"
              >
                繼續選購
              </button>
              <button
                onClick={checkout}
                className="w-full sm:w-auto px-6 py-3 bg-[#5a6440] text-white rounded-md hover:bg-opacity-90 transition duration-200"
              >
                前往結帳
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
