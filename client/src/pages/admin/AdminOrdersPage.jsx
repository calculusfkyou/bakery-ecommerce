import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronDown, FiEye } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import authAxios from '../../utils/authAxios';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // 載入訂單資料
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 修改這裡，使用 authAxios 替代 axios
        const response = await authAxios.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('獲取訂單失敗:', err);
        setError('無法加載訂單數據，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 過濾和搜尋訂單
  const filteredOrders = orders.filter(order => {
    // 狀態過濾
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    // 搜尋功能 (依訂單編號、客戶名稱)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hasOrderNumber = order.orderNumber.toLowerCase().includes(searchLower);
      const hasCustomerName =
        (order.deliveryMethod === 'delivery' && order.deliveryInfo?.name.toLowerCase().includes(searchLower)) ||
        (order.deliveryMethod === 'pickup' && order.pickupInfo?.name.toLowerCase().includes(searchLower));

      return hasOrderNumber || hasCustomerName;
    }

    return true;
  });

  // 依訂單日期排序（最新的在前面）
  const sortedOrders = [...filteredOrders].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // 取得訂單顧客資訊
  const getCustomerInfo = (order) => {
    if (order.deliveryMethod === 'delivery') {
      return order.deliveryInfo?.name;
    } else {
      return order.pickupInfo?.name;
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a6440]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* 搜尋和過濾區域 */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜尋訂單編號或客戶名稱"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
          >
            <FiFilter className="mr-2" />
            {filterStatus === 'all' ? '所有狀態' : filterStatus}
            <FiChevronDown className="ml-2" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {['all', '待處理', '製作中', '待配送/取貨', '已完成', '已取消'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setFilterOpen(false);
                    }}
                    className={`${
                      filterStatus === status ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                  >
                    {status === 'all' ? '所有狀態' : status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 訂單列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                訂單編號
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日期
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                配送方式
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCustomerInfo(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    NT$ {order.totalAmount.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.deliveryMethod === 'delivery' ? '宅配' : '門市取貨'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-[#5a6440] hover:text-[#47512f] inline-flex items-center"
                    >
                      <FiEye className="mr-1" /> 詳情
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  沒有找到符合條件的訂單
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
