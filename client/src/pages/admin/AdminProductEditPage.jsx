import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllProducts, saveProduct, getProductById } from '../../services/productService';

export default function AdminProductEditPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 臨時狀態，用於添加選項
  const [tempSize, setTempSize] = useState('');
  const [tempFlavor, setTempFlavor] = useState('');
  const [tempDecoration, setTempDecoration] = useState('');

  // 表單數據
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '經典系列',
    sectionType: 'classic',
    ingredients: '',
    allergens: '',
    freshness: '',
    isActive: true,
    status: 'in_stock',
    popular: false,
    new: false,
    discount: false,
    discountPercentage: 0,
    customizable: false,
    customOptions: {
      sizes: [],
      flavors: [],
      decorations: [],
      message: false,
      messageMaxLength: 50,
      advance_days: 0
    }
  });

  // 選項列表
  const categoryOptions = [
    { value: '經典系列', label: '經典系列' },
    { value: '特製蛋糕', label: '特製蛋糕' },
    { value: '其他甜點', label: '其他甜點' }
  ];

  const sectionTypeOptions = [
    { value: 'recommended', label: '推薦商品' },
    { value: 'classic', label: '經典系列' },
    { value: 'special', label: '特製蛋糕' },
    { value: 'mix', label: '其他甜點' }
  ];

  const statusOptions = [
    { value: 'in_stock', label: '有庫存' },
    { value: 'limited_stock', label: '庫存有限' },
    { value: 'pre_order', label: '預購中' },
    { value: 'out_of_stock', label: '無庫存' }
  ];

  // 載入商品數據
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        if (productId) {
          // 編輯現有商品
          const product = await getProductById(productId);
          if (product) {
            setFormData({
              ...product,
              customOptions: {
                sizes: product.customOptions?.sizes || [],
                flavors: product.customOptions?.flavors || [],
                decorations: product.customOptions?.decorations || [],
                message: product.customOptions?.message || false,
                messageMaxLength: product.customOptions?.messageMaxLength || 50,
                advance_days: product.customOptions?.advance_days || 0
              }
            });
          } else {
            setError('找不到指定的商品');
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('獲取商品失敗:', err);
        setError('獲取商品失敗，請稍後再試');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // 顯示通知
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (productId === 'new') {
        setLoading(false);
        return;
      }

      try {
        const product = await getProductById(parseInt(productId));
        if (product) {
          // 處理價格格式，將 "$45" 轉換為純數字 45
          let numericPrice = product.price;
          if (typeof product.price === 'string') {
            const priceMatch = product.price.match(/\$(\d+)/);
            if (priceMatch) {
              numericPrice = parseInt(priceMatch[1], 10);
            }
          }

          setFormData({
            ...product,
            price: numericPrice, // 使用轉換後的純數字
            customOptions: {
              ...product.customOptions
            }
          });
        }
      } catch (error) {
        setError('載入商品失敗: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // 修改 handleSubmit 函數中的價格處理邏輯
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      setSaving(true);

      // 創建一個商品數據的副本，以便進行格式轉換
      const productToSave = { ...formData };

      // 將純數字價格轉換為字串格式 "$45"
      productToSave.price = `$${productToSave.price}`;

      // 保存商品
      const savedProduct = await saveProduct(productToSave);

      showToast('商品已成功保存!', 'success');

      // 如果是新增商品，導航到編輯頁面
      if (!productId || productId === 'new') {
        navigate(`/admin/products/edit/${savedProduct.id}`);
      }
    } catch (error) {
      console.error('保存商品失敗:', error);
      showToast('保存商品失敗: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 處理表單輸入變更
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 處理客製化選項變更
  const handleCustomOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name.split('.');

    if (fieldName.length === 2 && fieldName[0] === 'customOptions') {
      setFormData(prevState => ({
        ...prevState,
        customOptions: {
          ...prevState.customOptions,
          [fieldName[1]]: type === 'checkbox' ? checked : value
        }
      }));
    }
  };

  // 處理圖片選擇
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 添加尺寸選項
  const handleAddSize = () => {
    if (tempSize.trim() && !formData.customOptions.sizes.includes(tempSize.trim())) {
      setFormData({
        ...formData,
        customOptions: {
          ...formData.customOptions,
          sizes: [...formData.customOptions.sizes, tempSize.trim()]
        }
      });
      setTempSize('');
    }
  };

  // 添加口味選項
  const handleAddFlavor = () => {
    if (tempFlavor.trim() && !formData.customOptions.flavors.includes(tempFlavor.trim())) {
      setFormData({
        ...formData,
        customOptions: {
          ...formData.customOptions,
          flavors: [...formData.customOptions.flavors, tempFlavor.trim()]
        }
      });
      setTempFlavor('');
    }
  };

  // 添加裝飾選項
  const handleAddDecoration = () => {
    if (tempDecoration.trim() && !formData.customOptions.decorations.includes(tempDecoration.trim())) {
      setFormData({
        ...formData,
        customOptions: {
          ...formData.customOptions,
          decorations: [...formData.customOptions.decorations, tempDecoration.trim()]
        }
      });
      setTempDecoration('');
    }
  };

  // 移除選項
  const handleRemoveOption = (type, index) => {
    setFormData({
      ...formData,
      customOptions: {
        ...formData.customOptions,
        [type]: formData.customOptions[type].filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <div className="text-red-700">{error}</div>
        </div>
        <Link to="/admin/products" className="text-[#5a6440] hover:underline flex items-center">
          <FiArrowLeft className="mr-1" /> 返回商品列表
        </Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* 顯示通知 */}
      {toast.show && (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md z-50 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
            toast.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' :
              'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
          }`}>
          {toast.message}
        </div>
      )}

      {/* 頁面標題 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin/products" className="text-gray-600 hover:text-gray-800 flex items-center mb-2">
            <FiArrowLeft className="mr-1" /> 返回商品列表
          </Link>
          <h1 className="text-2xl font-bold">{productId ? '編輯商品' : '新增商品'}</h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-[#5a6440] text-white rounded-md hover:bg-[#47512f] transition duration-200 flex items-center"
        >
          <FiSave className="mr-1" /> {saving ? '保存中...' : '保存商品'}
        </button>
      </div>

      {/* 表單 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左側欄 - 基本信息 */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">基本信息</h2>

              {/* 商品名稱 */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  商品名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* 商品描述 */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>

              {/* 商品圖片 */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  商品圖片
                </label>
                <div className="flex items-center">
                  {formData.image && (
                    <img src={formData.image} alt="商品預覽" className="h-16 w-16 object-cover mr-2 rounded" />
                  )}
                  <label className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 flex items-center text-sm">
                    <FiUpload className="mr-1" /> 上傳圖片
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">建議尺寸: 800x800px，格式: jpg, png</p>
              </div>

              {/* 商品價格 */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  售價 <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 border border-r-0 border-gray-300 rounded-l-md">
                    NT$
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    required
                    className="w-full border border-gray-300 rounded-r-md p-2"
                  />
                </div>
              </div>

              {/* 折扣設置 */}
              <div className="mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="discount"
                    checked={formData.discount}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  設置折扣
                </label>

                {formData.discount && (
                  <div className="ml-6 flex flex-col space-y-3">
                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        原價
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 border border-r-0 border-gray-300 rounded-l-md">
                          NT$
                        </span>
                        <input
                          type="number"
                          id="originalPrice"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          min="0"
                          step="1"
                          className="w-full border border-gray-300 rounded-r-md p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                        折扣百分比
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          id="discountPercentage"
                          name="discountPercentage"
                          value={formData.discountPercentage}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="w-full border border-gray-300 rounded-l-md p-2"
                        />
                        <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 border border-l-0 border-gray-300 rounded-r-md">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 商品分類 */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  商品分類 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 區塊類型 */}
              <div className="mb-4">
                <label htmlFor="sectionType" className="block text-sm font-medium text-gray-700 mb-1">
                  區塊類型 <span className="text-red-500">*</span>
                </label>
                <select
                  id="sectionType"
                  name="sectionType"
                  value={formData.sectionType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                >
                  {sectionTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 商品狀態 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                    上架狀態
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={() => setFormData({ ...formData, isActive: true })}
                        className="mr-1"
                      />
                      <span className="text-sm">已上架</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={!formData.isActive}
                        onChange={() => setFormData({ ...formData, isActive: false })}
                        className="mr-1"
                      />
                      <span className="text-sm">已下架</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    庫存狀態
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 商品標籤 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品標籤
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    熱門商品
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="new"
                      checked={formData.new}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    新品
                  </label>
                </div>
              </div>
            </div>

            {/* 右側欄 - 詳細信息 */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">詳細信息</h2>

              {/* 食材 */}
              <div className="mb-4">
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                  食材/成分
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="例如：麵粉、雞蛋、牛奶..."
                ></textarea>
              </div>

              {/* 過敏原 */}
              <div className="mb-4">
                <label htmlFor="allergens" className="block text-sm font-medium text-gray-700 mb-1">
                  過敏原
                </label>
                <textarea
                  id="allergens"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="例如：麩質、乳製品、堅果..."
                ></textarea>
              </div>

              {/* 保存期限 */}
              <div className="mb-4">
                <label htmlFor="freshness" className="block text-sm font-medium text-gray-700 mb-1">
                  保存期限
                </label>
                <input
                  type="text"
                  id="freshness"
                  name="freshness"
                  value={formData.freshness}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="例如：冷藏可保存3天"
                />
              </div>

              {/* 客製化選項設置 */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="customizable"
                      checked={formData.customizable}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="font-medium">允許客製化</span>
                  </label>
                </div>
              </div>

              {/* 顯示客製化選項，僅當啟用客製化時 */}
              {formData.customizable && (
                <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700">客製化選項設置</h3>

                  {/* 尺寸選項 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      尺寸選項
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={tempSize}
                        onChange={(e) => setTempSize(e.target.value)}
                        placeholder="輸入尺寸"
                        className="flex-grow border border-gray-300 rounded-l-md p-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="bg-[#5a6440] text-white px-3 rounded-r-md flex items-center"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.customOptions.sizes && formData.customOptions.sizes.map((size, index) => (
                        <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                          {size}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption('sizes', index)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 口味選項 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      口味選項
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={tempFlavor}
                        onChange={(e) => setTempFlavor(e.target.value)}
                        placeholder="輸入口味選項"
                        className="flex-grow border border-gray-300 rounded-l-md p-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddFlavor}
                        className="bg-[#5a6440] text-white px-3 rounded-r-md flex items-center"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.customOptions.flavors && formData.customOptions.flavors.map((flavor, index) => (
                        <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                          {flavor}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption('flavors', index)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 裝飾選項 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      裝飾選項
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={tempDecoration}
                        onChange={(e) => setTempDecoration(e.target.value)}
                        placeholder="輸入裝飾選項"
                        className="flex-grow border border-gray-300 rounded-l-md p-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddDecoration}
                        className="bg-[#5a6440] text-white px-3 rounded-r-md flex items-center"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.customOptions.decorations && formData.customOptions.decorations.map((decoration, index) => (
                        <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                          {decoration}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption('decorations', index)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 客製化訊息選項 */}
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="customOptions.message"
                        checked={formData.customOptions.message}
                        onChange={handleCustomOptionChange}
                        className="mr-2"
                      />
                      允許添加訊息
                    </label>

                    {formData.customOptions.message && (
                      <div className="mt-2 ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最大字數限制
                        </label>
                        <input
                          type="number"
                          name="customOptions.messageMaxLength"
                          value={formData.customOptions.messageMaxLength}
                          onChange={handleCustomOptionChange}
                          min="1"
                          max="100"
                          className="w-24 border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* 預訂提前天數 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      需提前預訂天數
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="customOptions.advance_days"
                        value={formData.customOptions.advance_days}
                        onChange={handleCustomOptionChange}
                        min="0"
                        max="30"
                        className="w-24 border border-gray-300 rounded-md p-2"
                      />
                      <span className="ml-2 text-sm text-gray-500">天 (0 表示不需要預訂)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* 預覽區塊 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">商品預覽</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-100 p-4 rounded-md mb-4 max-w-sm">
              <img
                src={formData.image || '/assets/Logo.png'}
                alt="商品預覽"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-3">
                <h3 className="font-medium text-lg">{formData.name || '商品名稱'}</h3>
                <p className="text-gray-600 text-sm mt-1">{formData.description || '商品描述...'}</p>
                <p className="text-[#5a6440] font-medium mt-2">{formData.price || '$0'}</p>

                {formData.customizable && (
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">可客製化</span>
                  </div>
                )}

                {formData.popular && (
                  <div className="mt-1 text-xs">
                    <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded">熱門商品</span>
                  </div>
                )}

                {formData.new && (
                  <div className="mt-1 text-xs">
                    <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">新品</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">商品資訊</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-500 w-1/3">商品分類</td>
                  <td className="py-2">{formData.category}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500">區塊類型</td>
                  <td className="py-2">
                    {sectionTypeOptions.find(o => o.value === formData.sectionType)?.label || formData.sectionType}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500">商品狀態</td>
                  <td className="py-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {formData.isActive ? '已上架' : '已下架'}
                    </span>
                    {' '}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${formData.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                        formData.status === 'limited_stock' ? 'bg-yellow-100 text-yellow-800' :
                          formData.status === 'pre_order' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}>
                      {statusOptions.find(o => o.value === formData.status)?.label || formData.status}
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500">成分</td>
                  <td className="py-2">{formData.ingredients || '無'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500">過敏原</td>
                  <td className="py-2">{formData.allergens || '無'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500">保存期限</td>
                  <td className="py-2">{formData.freshness || '無'}</td>
                </tr>
              </tbody>
            </table>

            {formData.customizable && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-800 mb-2">客製化選項</h3>
                <div className="space-y-2 text-sm">
                  {formData.customOptions.sizes?.length > 0 && (
                    <p><span className="text-gray-500">尺寸選項:</span> {formData.customOptions.sizes.join(', ')}</p>
                  )}
                  {formData.customOptions.flavors?.length > 0 && (
                    <p><span className="text-gray-500">口味選項:</span> {formData.customOptions.flavors.join(', ')}</p>
                  )}
                  {formData.customOptions.decorations?.length > 0 && (
                    <p><span className="text-gray-500">裝飾選項:</span> {formData.customOptions.decorations.join(', ')}</p>
                  )}
                  {formData.customOptions.message && (
                    <p><span className="text-gray-500">訊息:</span> 允許 (最多 {formData.customOptions.messageMaxLength} 字)</p>
                  )}
                  {formData.customOptions.advance_days > 0 && (
                    <p><span className="text-gray-500">預訂需提前:</span> {formData.customOptions.advance_days} 天</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
