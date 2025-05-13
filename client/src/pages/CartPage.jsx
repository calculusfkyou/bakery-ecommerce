import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FiShoppingBag, FiArrowRight, FiTrash, FiPlus, FiMinus, FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const isFirstRender = useRef(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [allChecked, setAllChecked] = useState(true);

  // 從 localStorage 獲取購物車資料
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);

    // 載入推薦商品
    loadRecommendations();
  }, [location]);

  useEffect(() => {
    const initialCheckedState = {};
    cartItems.forEach(item => {
      const itemKey = `${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`;
      initialCheckedState[itemKey] = true;
    });
    setCheckedItems(initialCheckedState);
  }, [cartItems.length]); // 只在項目數量變化時運行

  // 載入推薦商品
  const loadRecommendations = () => {
    // 這裡應該是從API獲取或者從其他數據源獲取推薦商品
    // 現在使用模擬數據
    const simulatedRecommendations = [
      {
        id: 301,
        name: "草莓鮮奶油蛋糕",
        description: "新鮮草莓搭配輕盈鮮奶油，清爽不膩",
        basePrice: 580,
        image: "/assets/Logo.png",
        customizable: true,
        customOptions: {
          sizes: ["6吋", "8吋", "10吋"],
          flavors: ["原味", "香草", "檸檬"],
          decorations: ["無", "水果裝飾", "巧克力碎片"]
        }
      },
      {
        id: 302,
        name: "巧克力慕斯蛋糕",
        description: "比利時進口巧克力製成，濃郁滑順",
        basePrice: 620,
        image: "/assets/Logo.png",
        customizable: true,
        customOptions: {
          sizes: ["6吋", "8吋"],
          flavors: ["黑巧克力", "白巧克力", "榛果巧克力"],
          decorations: ["無", "巧克力片", "金箔"]
        }
      },
      {
        id: 303,
        name: "檸檬乳酪蛋糕",
        description: "紐約經典風味，綿密乳酪與清爽檸檬的完美結合",
        basePrice: 550,
        image: "/assets/Logo.png",
        customizable: true,
        customOptions: {
          sizes: ["6吋", "8吋"],
          flavors: ["原味", "藍莓"],
          decorations: ["無", "檸檬片", "水果"]
        }
      },
      {
        id: 102,
        name: "法式巧克力可頌",
        description: "加入比利時進口巧克力",
        basePrice: 55,
        image: "/assets/Logo.png",
        customizable: false
      }
    ];

    setRecommendations(simulatedRecommendations);

    // 初始化選項
    const initialOptions = {};
    simulatedRecommendations.forEach(product => {
      if (product.customizable && product.customOptions) {
        initialOptions[product.id] = {
          size: product.customOptions.sizes ? product.customOptions.sizes[0] : '',
          flavor: product.customOptions.flavors ? product.customOptions.flavors[0] : '',
          decoration: product.customOptions.decorations ? product.customOptions.decorations[0] : '',
          quantity: 1
        };
      } else {
        initialOptions[product.id] = {
          quantity: 1
        };
      }
    });
    setSelectedOptions(initialOptions);
  };

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

  // 處理單個勾選變更
  const handleItemCheck = (itemKey) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [itemKey]: !prev[itemKey] };
      // 檢查是否所有項目都被勾選
      const allItemsChecked = Object.values(updated).every(v => v);
      setAllChecked(allItemsChecked);
      return updated;
    });
  };

  // 處理全選/取消全選
  const handleToggleAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);

    const updatedChecked = {};
    cartItems.forEach(item => {
      const itemKey = `${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`;
      updatedChecked[itemKey] = newAllChecked;
    });
    setCheckedItems(updatedChecked);
  };

  // 根據勾選狀態計算總價
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemKey = `${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`;
      return total + (checkedItems[itemKey] ? item.price * item.quantity : 0);
    }, 0);
  };

  // 處理推薦商品選項變更
  const handleOptionChange = (productId, option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [option]: value
      }
    }));
  };

  // 處理推薦商品數量變更
  const handleRecommendQuantityChange = (productId, change) => {
    setSelectedOptions(prev => {
      const updatedOptions = { ...prev };
      const currentQuantity = updatedOptions[productId].quantity || 1;

      // 確保數量不會小於1
      if ((currentQuantity + change) >= 1) {
        updatedOptions[productId].quantity = currentQuantity + change;
      }

      return updatedOptions;
    });
  };

  // 計算推薦商品的價格
  const calculatePrice = (product, options) => {
    if (!product.customizable) return product.basePrice;

    let price = product.basePrice;

    // 根據尺寸調整價格
    if (options && options.size === '8吋') price += 200;
    else if (options && options.size === '10吋') price += 400;

    // 根據口味調整價格
    if (options && options.flavor && options.flavor !== '原味') price += 50;

    // 根據裝飾調整價格 - 修正括號位置問題
    if ((options && options.decoration === '金箔') || (options && options.decoration === '鮮花裝飾(可食用)')) {
      price += 100;
    }

    return price;
  };

  // 從推薦商品添加到購物車
  // 從推薦商品添加到購物車
  const addToCartFromRecommendation = (product) => {
    const options = selectedOptions[product.id];
    const currentQuantity = options.quantity || 1;

    // 構建購物車項目
    const cartItem = {
      id: product.id,
      name: product.name,
      price: calculatePrice(product, options),
      image: product.image,
      quantity: currentQuantity,
      customOptions: product.customizable ? {
        size: options.size,
        flavor: options.flavor,
        decoration: options.decoration
      } : null
    };

    // 保存產品和當前選擇的數量 (只設置一次)
    setAddedProduct({
      ...product,
      name: product.name,
      currentQuantity: currentQuantity
    });

    // 從本地存儲獲取現有購物車
    const currentCart = [...cartItems];

    // 檢查是否已有相同商品和相同選項
    const existingItemIndex = currentCart.findIndex(item =>
      item.id === product.id &&
      (product.customizable ? (
        item.customOptions?.size === options.size &&
        item.customOptions?.flavor === options.flavor &&
        item.customOptions?.decoration === options.decoration
      ) : true)
    );

    if (existingItemIndex !== -1) {
      // 如果已有相同商品，增加數量
      currentCart[existingItemIndex].quantity += currentQuantity;
    } else {
      // 否則添加新商品
      currentCart.push(cartItem);
    }

    // 更新購物車
    setCartItems(currentCart);

    // 顯示添加成功的訊息 (移除重複的setAddedProduct)
    setShowModal(true);

    // 重設該商品的選項數量為1
    setSelectedOptions(prev => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        quantity: 1
      }
    }));
  };

  // 添加成功的彈窗
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FiCheck className="text-green-500 text-2xl" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">已加入購物車</h3>
          <p className="text-gray-600 mb-6">
            {addedProduct?.name} x {addedProduct?.currentQuantity || 1} 已成功加入購物車
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-[#5a6440] text-[#5a6440] rounded-md hover:bg-[#f7f5f0] transition duration-200 flex items-center justify-center"
            >
              <FiArrowRight className="mr-2" /> 繼續購物
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-[#5a6440] text-white rounded-md hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" /> 查看購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#5a6440] pb-2 inline-block">您的購物車</h1>

        {cartItems.length === 0 ? (
          // 空購物車的顯示
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-dashed border-gray-200">
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
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            {/* 購物車頭部 - 模擬附圖中的標題列 */}
            <div className="grid grid-cols-12 gap-2 py-4 px-6 border-b border-gray-200 bg-gray-100 hidden md:grid">
              <div className="col-span-6">
                <span className="font-medium text-gray-700">商品</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium text-gray-700">單價</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium text-gray-700">數量</span>
              </div>
              <div className="col-span-1 text-right">
                <span className="font-medium text-gray-700">總計</span>
              </div>
              <div className="col-span-1 text-right">
                <span className="font-medium text-gray-700">操作</span>
              </div>
            </div>

            {/* 購物車商店區塊 */}
            <div className="border-b border-gray-300 py-3 px-6 bg-blue-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-[#5a6440] focus:ring-[#5a6440] border-gray-300 rounded mr-3"
                  checked={allChecked}
                  onChange={handleToggleAll}
                />
                <span className="text-sm font-medium">
                  <FiShoppingBag className="inline-block mr-1 text-[#5a6440]" />
                  匠心麵包坊
                </span>
              </div>
            </div>

            {/* 購物車項目列表 */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`}
                  className="grid grid-cols-12 gap-2 items-center py-6 px-6 hover:bg-gray-50 transition-colors"
                >
                  {/* 選擇框和商品圖片 + 名稱 */}
                  <div className="col-span-12 md:col-span-6 flex items-start">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-[#5a6440] focus:ring-[#5a6440] border-gray-300 rounded mr-3 mt-2"
                      checked={checkedItems[`${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`] || false}
                      onChange={() => handleItemCheck(`${item.id}-${item.customOptions?.size || ''}-${item.customOptions?.flavor || ''}`)}
                    />
                    <div className="w-20 h-20 flex-shrink-0 mr-4 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800">{item.name}</h3>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.customOptions?.size && (
                          <span className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded-full">尺寸: {item.customOptions.size}</span>
                        )}
                        {item.customOptions?.flavor && (
                          <span className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded-full">口味: {item.customOptions.flavor}</span>
                        )}
                        {item.customOptions?.decoration && (
                          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">裝飾: {item.customOptions.decoration}</span>
                        )}
                      </div>
                      {item.customOptions?.message && (
                        <div className="text-xs text-gray-600 mt-1 italic">
                          「{item.customOptions.message}」
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 單價 */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <div className="text-sm font-medium text-gray-800">
                      ${item.price.toFixed(0)}
                    </div>
                  </div>

                  {/* 數量控制 */}
                  <div className="col-span-4 md:col-span-2 flex justify-center items-center">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus className="text-gray-500 text-xs" />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="px-2 py-1 w-10 text-center border-t border-b border-gray-300 bg-white text-sm"
                    />
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    >
                      <FiPlus className="text-gray-500 text-xs" />
                    </button>
                  </div>

                  {/* 項目總價 */}
                  <div className="col-span-2 md:col-span-1 text-right">
                    <div className="font-medium text-sm text-red-500">
                      ${(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="col-span-2 md:col-span-1 text-right">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 購物車摘要 */}
            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t-2 border-gray-200">
              <div className="flex items-center mb-4 sm:mb-0">
                <button
                  onClick={clearCart}
                  className="flex items-center text-gray-500 hover:text-red-500 text-sm transition-colors duration-200"
                >
                  <FiTrash className="mr-1" /> 清空購物車
                </button>
                <span className="mx-4 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  已選 <span className="font-medium">{cartItems.length}</span> 件商品
                </span>
              </div>

              <div className="flex items-center">
                <div className="mr-6">
                  <span className="text-sm text-gray-600">合計:</span>
                  <span className="ml-2 text-xl font-bold text-red-500">${calculateTotalPrice().toFixed(0)}</span>
                </div>
                <button
                  onClick={checkout}
                  className="px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm font-medium shadow-md"
                >
                  去結帳
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 猜你喜歡區塊 */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-[#5a6440] pb-2 inline-block">猜你喜歡</h2>
            <Link
              to="/products"
              className="text-[#5a6440] hover:underline flex items-center text-sm"
            >
              查看更多 <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-800 hover:text-[#5a6440] transition-colors duration-300">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  {product.customizable && (
                    <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded-md">
                      {product.customOptions.sizes && (
                        <div className="flex flex-wrap items-center">
                          <span className="text-xs text-gray-500 mr-2 w-10">尺寸:</span>
                          <div className="flex flex-wrap gap-1">
                            {product.customOptions.sizes.map(size => (
                              <button
                                key={size}
                                onClick={() => handleOptionChange(product.id, 'size', size)}
                                className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${selectedOptions[product.id]?.size === size
                                  ? 'bg-[#5a6440] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.customOptions.flavors && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">口味:</label>
                          <select
                            value={selectedOptions[product.id]?.flavor}
                            onChange={(e) => handleOptionChange(product.id, 'flavor', e.target.value)}
                            className="w-full text-sm py-1 px-2 border border-gray-300 rounded focus:ring-[#5a6440] focus:border-[#5a6440]"
                          >
                            {product.customOptions.flavors.map(flavor => (
                              <option key={flavor} value={flavor}>{flavor}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product.customOptions.decorations && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">裝飾:</label>
                          <select
                            value={selectedOptions[product.id]?.decoration}
                            onChange={(e) => handleOptionChange(product.id, 'decoration', e.target.value)}
                            className="w-full text-sm py-1 px-2 border border-gray-300 rounded focus:ring-[#5a6440] focus:border-[#5a6440]"
                          >
                            {product.customOptions.decorations.map(decoration => (
                              <option key={decoration} value={decoration}>{decoration}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                    <div>
                      <p className="text-lg font-bold text-[#5a6440]">
                        ${calculatePrice(product, selectedOptions[product.id]).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        總計: ${(calculatePrice(product, selectedOptions[product.id]) * (selectedOptions[product.id]?.quantity || 1)).toFixed(0)}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <button
                          onClick={() => {
                            // 直接獲取當前數量並減1
                            const currentQty = selectedOptions[product.id]?.quantity || 1;
                            if (currentQty > 1) {
                              setSelectedOptions(prev => ({
                                ...prev,
                                [product.id]: {
                                  ...prev[product.id],
                                  quantity: currentQty - 1
                                }
                              }));
                            }
                          }}
                          className="p-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                          disabled={selectedOptions[product.id]?.quantity <= 1}
                        >
                          <FiMinus className="text-gray-500 text-xs" />
                        </button>
                        <span className="px-2 py-0.5 border-t border-b border-gray-300 bg-white text-center w-8 text-sm">
                          {selectedOptions[product.id]?.quantity || 1}
                        </span>
                        <button
                          onClick={() => {
                            // 直接獲取當前數量並加1
                            const currentQty = selectedOptions[product.id]?.quantity || 1;
                            setSelectedOptions(prev => ({
                              ...prev,
                              [product.id]: {
                                ...prev[product.id],
                                quantity: currentQty + 1
                              }
                            }));
                          }}
                          className="p-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        >
                          <FiPlus className="text-gray-500 text-xs" />
                        </button>
                      </div>

                      <button
                        onClick={() => addToCartFromRecommendation(product)}
                        className="p-2 bg-[#5a6440] text-white rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md"
                        title="加入購物車"
                      >
                        <FiShoppingCart className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <SuccessModal />}
      <Footer />
    </div>
  );
}
