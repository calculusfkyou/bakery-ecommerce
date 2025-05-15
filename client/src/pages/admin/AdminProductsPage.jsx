import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiPlusCircle, FiEdit, FiTrash2, FiEye, FiToggleRight, FiToggleLeft } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllProductsAdmin, toggleProductStatus, deleteProduct } from '../../services/productService';

// Toast 訊息組件
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastClasses = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-500 text-green-800';
      case 'error': return 'bg-red-50 border-red-500 text-red-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className={`fixed top-5 right-5 p-4 border-l-4 rounded-md shadow-md z-50 ${getToastClasses()}`}>
      <div className="flex justify-between">
        <p>{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-4">×</button>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 載入商品資料
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProductsAdmin();
        setProducts(data);
      } catch (error) {
        console.error('載入商品失敗:', error);
        showToast('載入商品失敗', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 處理上架/下架狀態切換
  const handleToggleStatus = async (product) => {
    try {
      const updatedProduct = await toggleProductStatus(product.id);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      showToast(`商品已${updatedProduct.isActive ? '上架' : '下架'}`, 'success');
    } catch (error) {
      console.error('變更商品狀態失敗:', error);
      showToast('變更商品狀態失敗', 'error');
    }
  };

  // 處理刪除商品
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('確定要刪除此商品嗎？此操作無法還原。')) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('商品已刪除', 'success');
    } catch (error) {
      console.error('刪除商品失敗:', error);
      showToast('刪除商品失敗', 'error');
    }
  };

  // 顯示訊息
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // 關閉訊息
  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // 篩選商品
  const filteredProducts = products.filter(product => {
    // 搜尋詞過濾
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!searchMatch) return false;

    // 類別過濾
    if (filterCategory !== 'all' && product.category !== filterCategory) {
      return false;
    }

    // 狀態過濾
    if (filterStatus === 'active' && !product.isActive) {
      return false;
    }
    if (filterStatus === 'inactive' && product.isActive) {
      return false;
    }

    return true;
  });

  // 取得所有可用類別
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  return (
    <AdminLayout>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">商品管理</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-[#5a6440] text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlusCircle className="mr-2" /> 新增商品
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* 搜尋欄位 */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="搜尋商品名稱或描述..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* 篩選按鈕 */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md"
            >
              <FiFilter className="mr-2" /> 篩選
            </button>

            {/* 篩選菜單 */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                <div className="p-4">
                  <h3 className="font-semibold mb-2">商品類別</h3>
                  <div className="mb-4">
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === 'all'}
                        onChange={() => setFilterCategory('all')}
                        className="mr-2"
                      />
                      所有類別
                    </label>
                    {categories.map(category => (
                      <label key={category} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="category"
                          checked={filterCategory === category}
                          onChange={() => setFilterCategory(category)}
                          className="mr-2"
                        />
                        {category}
                      </label>
                    ))}
                  </div>

                  <h3 className="font-semibold mb-2">商品狀態</h3>
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filterStatus === 'all'}
                        onChange={() => setFilterStatus('all')}
                        className="mr-2"
                      />
                      全部商品
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filterStatus === 'active'}
                        onChange={() => setFilterStatus('active')}
                        className="mr-2"
                      />
                      已上架商品
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filterStatus === 'inactive'}
                        onChange={() => setFilterStatus('inactive')}
                        className="mr-2"
                      />
                      已下架商品
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a6440] mx-auto"></div>
          <p className="mt-4 text-gray-500">載入商品中...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              沒有符合條件的商品
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類別
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    價格
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className={!product.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={product.image || '/assets/Logo.png'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? '已上架' : '已下架'}
                      </span>
                      {product.status === 'limited_stock' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          數量有限
                        </span>
                      )}
                      {product.status === 'pre_order' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          需預訂
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-blue-500 hover:text-blue-700"
                          target="_blank"
                          title="在前台查看"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="編輯商品"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className={product.isActive ? "text-gray-500 hover:text-gray-700" : "text-green-500 hover:text-green-700"}
                          title={product.isActive ? "下架商品" : "上架商品"}
                        >
                          {product.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                          title="刪除商品"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
