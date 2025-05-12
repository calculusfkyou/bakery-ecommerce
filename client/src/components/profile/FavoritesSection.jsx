import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function FavoritesSection({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 從 localStorage 獲取最愛清單數據
  useEffect(() => {
    try {
      // 從 localStorage 讀取最愛清單
      const userFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(userFavorites);
      setLoading(false);
    } catch (err) {
      console.error('獲取最愛清單錯誤:', err);
      setError('無法載入最愛清單');
      setLoading(false);
    }
  }, []);

  // 移除最愛商品
  const handleRemoveFavorite = (productId) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // 加入購物車
  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
      quantity: 1
    };

    // 從本地存儲獲取現有購物車
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // 檢查是否已有相同商品
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      // 如果已有相同商品，增加數量
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // 否則添加新商品
      currentCart.push(cartItem);
    }

    // 保存回本地存儲
    localStorage.setItem('cart', JSON.stringify(currentCart));

    // 顯示成功訊息（這裡可以改為更好的用戶提示）
    alert(`已將 ${product.name} 加入購物車`);
  };

  if (loading) {
    return <div className="text-center py-8">載入最愛清單中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">我的最愛</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-5xl mb-4">
            <FiHeart className="inline" />
          </div>
          <p className="text-gray-500 mb-4">您的最愛清單還是空的</p>
          <Link
            to="/products"
            className="px-4 py-2 bg-[#5a6440] text-white rounded-md hover:bg-opacity-90"
          >
            去逛逛商品
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden flex">
              {/* 商品圖片 */}
              <Link to={`/product/${product.id}`} className="w-1/3 h-32">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* 商品資訊 */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product.id}`} className="font-medium hover:text-[#5a6440]">
                    {product.name}
                  </Link>
                  <p className="text-[#5a6440] mt-1">NT$ {product.basePrice}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">{product.description}</p>
                </div>

                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="p-2 text-gray-500 hover:text-red-500"
                    title="從最愛移除"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 text-gray-500 hover:text-[#5a6440]"
                    title="加入購物車"
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
