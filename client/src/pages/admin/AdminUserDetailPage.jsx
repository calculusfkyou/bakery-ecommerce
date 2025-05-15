import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUser, FiLock, FiCheckCircle } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import authAxios from '../../utils/authAxios';

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isNewUser = userId === 'new';
  const [loading, setLoading] = useState(!isNewUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isVerified: false,
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isNewUser) {
      fetchUserData();
    }
  }, [userId, isNewUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // 使用 API 獲取會員數據
      const response = await authAxios.get(`/auth/users/${userId}`);
      const userData = response.data.data;

      // 使用 API 返回的數據設置表單
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        isVerified: userData.isVerified,
        password: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (err) {
      console.error('獲取會員數據失敗:', err);
      setError('無法載入會員資料');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表單驗證
    if (!formData.name || !formData.email) {
      setToast({
        show: true,
        message: '請填寫必填欄位',
        type: 'error'
      });
      return;
    }

    if (isNewUser && !formData.password) {
      setToast({
        show: true,
        message: '新會員需要設定密碼',
        type: 'error'
      });
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setToast({
        show: true,
        message: '密碼長度至少需要8個字元',
        type: 'error'
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setToast({
        show: true,
        message: '兩次輸入的密碼不一致',
        type: 'error'
      });
      return;
    }

    try {
      setSaving(true);

      // 準備要發送的數據
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isVerified: formData.isVerified
      };

      // 只有在有密碼的情況下添加密碼
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      // 使用 API 保存數據
      if (isNewUser) {
        // 創建新用戶
        await authAxios.post('/auth/users', dataToSend);
      } else {
        // 更新現有用戶
        await authAxios.put(`/auth/users/${userId}`, dataToSend);
      }

      setToast({
        show: true,
        message: isNewUser ? '會員創建成功' : '會員更新成功',
        type: 'success'
      });

      // 延遲導航，讓用戶看到成功訊息
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err) {
      console.error('保存會員數據失敗:', err);
      setToast({
        show: true,
        message: err.response?.data?.message || '保存失敗，請檢查數據後重試',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // 發送重置密碼郵件
  const handleSendResetEmail = async () => {
    try {
      await authAxios.post(`/auth/reset-password-request`, { email: formData.email });

      setToast({
        show: true,
        message: '已發送重置密碼電子郵件至會員信箱',
        type: 'success'
      });
    } catch (err) {
      console.error('發送重置密碼郵件失敗:', err);
      setToast({
        show: true,
        message: '發送重置密碼郵件失敗',
        type: 'error'
      });
    }
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

  if (error && !isNewUser) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <div className="text-red-700">{error}</div>
        </div>
        <Link to="/admin/users" className="text-[#5a6440] hover:underline flex items-center">
          <FiArrowLeft className="mr-1" /> 返回會員列表
        </Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* 通知訊息 */}
      {toast.show && (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md z-50 ${
          toast.type === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
          toast.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' :
          'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* 頁面標題 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin/users" className="text-gray-600 hover:text-gray-800 flex items-center mb-2">
            <FiArrowLeft className="mr-1" /> 返回會員列表
          </Link>
          <h1 className="text-2xl font-bold">{isNewUser ? '新增會員' : '編輯會員'}</h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-[#5a6440] text-white rounded-md hover:bg-[#47512f] transition duration-200 flex items-center"
        >
          <FiSave className="mr-1" /> {saving ? '儲存中...' : '儲存'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 個人資訊 */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                <FiUser className="mr-2" /> 個人資訊
              </h2>

              {/* 姓名 */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                  required
                />
              </div>

              {/* 電子郵件 */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                  required
                />
              </div>

              {/* 電話 */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  電話
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                />
              </div>

              {/* 角色 */}
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  角色
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                >
                  <option value="user">一般會員</option>
                  <option value="manager">經理</option>
                  <option value="admin">管理員</option>
                </select>
              </div>

              {/* 驗證狀態 */}
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#5a6440] focus:ring-[#5a6440] border-gray-300 rounded"
                  />
                  <label htmlFor="isVerified" className="ml-2 text-sm text-gray-700">
                    已驗證帳號
                  </label>
                </div>
              </div>
            </div>

            {/* 密碼設置 */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                <FiLock className="mr-2" /> 密碼設置
              </h2>

              {isNewUser ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    為新會員創建一個密碼，會員可以在登入後自行更改。
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    如果需要重置密碼，請在下方輸入新密碼。若留空，現有密碼將保持不變。
                  </p>
                </div>
              )}

              {/* 密碼 */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {isNewUser ? '密碼' : '新密碼'} {isNewUser && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                  required={isNewUser}
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">密碼長度至少需要8個字元</p>
              </div>

              {/* 確認密碼 */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  確認{isNewUser ? '密碼' : '新密碼'} {isNewUser && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440]"
                  required={isNewUser}
                />
              </div>

              {!isNewUser && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                  <div className="flex items-start">
                    <FiCheckCircle className="mt-0.5 mr-2 text-yellow-600" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        其他選項
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <button
                          type="button"
                          className="text-blue-600 hover:underline"
                          onClick={handleSendResetEmail}
                        >
                          發送重置密碼電子郵件
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
