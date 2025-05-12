import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FiMinus, FiPlus, FiHeart, FiCheck, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedDecoration, setSelectedDecoration] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 從所有商品中查找符合 ID 的產品
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ProductsPageModule = await import('./ProductsPage');

        // 正確獲取導出的變數
        const recommendedDrinksData = ProductsPageModule.recommendedDrinksData || [];
        const classicDrinksData = ProductsPageModule.classicDrinksData || [];

        // 檢查是否有這些變數
        const specialDrinksData = ProductsPageModule.specialDrinksData || [];
        const mixDrinksData = ProductsPageModule.mixDrinksData || [];

        // 這裡取得 ProductsPage.jsx 中定義的變數
        const allProducts = [
          ...recommendedDrinksData,
          ...classicDrinksData,
          ...specialDrinksData,
          ...mixDrinksData
        ].filter(item => item); // 過濾掉 undefined 項目

        console.log("所有商品:", allProducts);
        console.log("尋找商品 ID:", productId);

        const foundProduct = allProducts.find(p => p.id === parseInt(productId));
        console.log("找到商品:", foundProduct);

        if (foundProduct) {
          setProduct(foundProduct);

          // 設定初始選項
          if (foundProduct.customizable && foundProduct.customOptions) {
            foundProduct.customOptions.sizes && setSelectedSize(foundProduct.customOptions.sizes[0]);
            foundProduct.customOptions.flavors && setSelectedFlavor(foundProduct.customOptions.flavors[0]);
            foundProduct.customOptions.decorations && setSelectedDecoration(foundProduct.customOptions.decorations[0]);
          }

          // 設定基本價格
          const priceStr = foundProduct.price?.toString() || '';
          const priceMatch = priceStr.match(/\$(\d+)/);
          if (priceMatch) {
            setBasePrice(parseInt(priceMatch[1], 10));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("載入商品資料時發生錯誤:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    // 檢查用戶是否登入
    const userDisplay = localStorage.getItem('userDisplay');
    setIsLoggedIn(!!userDisplay);

    // 檢查產品是否已被收藏
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isProductFavorite = favorites.some(item => item.id === product.id);
      setIsFavorite(isProductFavorite);
    }
  }, [product]);

  // 添加收藏按鈕的處理函數
  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      // 如果未登入，提示用戶登入
      if (window.confirm('需要登入才能收藏商品。是否前往登入頁面？')) {
        navigate('/login');
      }
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      // 從最愛清單中移除
      const updatedFavorites = favorites.filter(item => item.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      // 添加到最愛清單
      const productToAdd = {
        id: product.id,
        name: product.name,
        description: product.description,
        basePrice: totalPrice / quantity,
        image: product.image
      };
      favorites.push(productToAdd);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // 更新狀態
    setIsFavorite(!isFavorite);
  };

  // 計算總價
  useEffect(() => {
    if (!product) return;

    let price = basePrice;

    // 根據尺寸調整價格
    if (product.customizable && selectedSize) {
      if (selectedSize === '8吋') price += 200;
      else if (selectedSize === '10吋') price += 400;
    }

    // 根據口味調整價格
    if (product.customizable && selectedFlavor) {
      if (selectedFlavor !== '原味') price += 50;
    }

    // 根據裝飾調整價格
    if (product.customizable && selectedDecoration) {
      if (selectedDecoration === '金箔' || selectedDecoration === '鮮花裝飾(可食用)') price += 100;
    }

    setTotalPrice(price * quantity);
  }, [basePrice, product, selectedSize, selectedFlavor, selectedDecoration, quantity]);

  const handleAddToCart = () => {
    // 構建購物車項目
    const cartItem = {
      id: product.id,
      name: product.name,
      price: totalPrice / quantity,
      image: product.image,
      quantity,
      customOptions: {
        size: selectedSize,
        flavor: selectedFlavor,
        decoration: selectedDecoration,
        message: customMessage
      }
    };

    // 從本地存儲獲取現有購物車
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // 檢查是否已有相同商品和相同選項
    const existingItemIndex = currentCart.findIndex(item =>
      item.id === product.id &&
      item.customOptions?.size === selectedSize &&
      item.customOptions?.flavor === selectedFlavor &&
      item.customOptions?.decoration === selectedDecoration &&
      item.customOptions?.message === customMessage
    );

    if (existingItemIndex !== -1) {
      // 如果已有相同商品，增加數量
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // 否則添加新商品
      currentCart.push(cartItem);
    }

    // 保存回本地存儲
    localStorage.setItem('cart', JSON.stringify(currentCart));

    setShowModal(true);
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up">
        <div className="text-center p-6">
          {/* 成功圖示 */}
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FiCheck className="text-green-500 text-2xl" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">已加入購物車</h3>
          <p className="text-gray-600 mb-6">{product.name} x {quantity} 已成功加入購物車</p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                navigate('/products');
              }}
              className="px-4 py-2 border border-[#5a6440] text-[#5a6440] rounded-md hover:bg-[#f7f5f0] transition duration-200 flex items-center justify-center"
            >
              <FiArrowRight className="mr-2" /> 繼續選購
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                navigate('/cart');
              }}
              className="px-4 py-2 bg-[#5a6440] text-white rounded-md hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" /> 前往購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a6440] mx-auto"></div>
            <p className="mt-4 text-gray-600">載入商品資訊中...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">找不到此商品</h2>
            <p className="text-gray-600 mb-6">該商品可能不存在或已被移除。</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#5a6440] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-200"
            >
              返回商品列表
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* 麵包屑導航 */}
        <div className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#5a6440]">首頁</a> &gt;
          <a href="/products" className="hover:text-[#5a6440] mx-1">商品列表</a> &gt;
          <span className="text-[#5a6440]">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 商品圖片 */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
              {product.status === 'limited_stock' && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  數量有限
                </div>
              )}
              {product.status === 'pre_order' && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  需預訂
                </div>
              )}
            </div>

            {/* 商品資訊 */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <FiHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-[#5a6440] text-xl font-medium mt-2">
                {product.price}
              </p>

              <div className="my-4 text-gray-600">
                <p>{product.description}</p>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">成分</p>
                    <p className="text-gray-700">{product.ingredients || '未提供'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">過敏原</p>
                    <p className="text-gray-700">{product.allergens || '未提供'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">保存期限</p>
                  <p className="text-gray-700">{product.freshness || '未提供'}</p>
                </div>
              </div>

              {/* 客製化選項 */}
              {product.customizable && product.customOptions && (
                <div className="border-t border-gray-200 my-4 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">客製化選項</h3>

                  {/* 尺寸選項 */}
                  {product.customOptions.sizes && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
                      <div className="grid grid-cols-3 gap-2">
                        {product.customOptions.sizes.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`py-2 px-4 rounded-md text-sm ${selectedSize === size
                              ? 'bg-[#5a6440] text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 口味選項 */}
                  {product.customOptions.flavors && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">口味</label>
                      <select
                        value={selectedFlavor}
                        onChange={(e) => setSelectedFlavor(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#5a6440] focus:border-[#5a6440]"
                      >
                        {product.customOptions.flavors.map(flavor => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 裝飾選項 */}
                  {product.customOptions.decorations && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">裝飾</label>
                      <select
                        value={selectedDecoration}
                        onChange={(e) => setSelectedDecoration(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#5a6440] focus:border-[#5a6440]"
                      >
                        {product.customOptions.decorations.map(decoration => (
                          <option key={decoration} value={decoration}>{decoration}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 客製化訊息 */}
                  {product.customOptions.message && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        客製化訊息 (最多 {product.customOptions.messageMaxLength} 字)
                      </label>
                      <textarea
                        rows="2"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        maxLength={product.customOptions.messageMaxLength}
                        placeholder="請輸入您希望在蛋糕上顯示的文字..."
                        className="w-full border-gray-300 rounded-md focus:ring-[#5a6440] focus:border-[#5a6440]"
                      ></textarea>
                    </div>
                  )}

                  {/* 預訂信息 */}
                  {product.customOptions.advance_days && (
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-blue-800 text-sm">
                        此商品需提前 {product.customOptions.advance_days} 天預訂
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 數量選擇 */}
              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">數量</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                    >
                      <FiMinus className="text-gray-500" />
                    </button>
                    <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-center w-12">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    >
                      <FiPlus className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 總價與加入購物車按鈕 */}
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-sm text-gray-500">總價</p>
                  <p className="text-2xl font-bold text-[#5a6440]">${totalPrice}</p>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#5a6440] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-200"
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <SuccessModal />}

      <Footer />
    </div>
  );
}
