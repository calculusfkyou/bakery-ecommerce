import React, { useState } from 'react';

export default function UserInfoSection({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 添加缺失的狀態變數
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  // 處理表單輸入變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 處理點擊頭像
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 處理文件選擇
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 僅接受圖片檔案
    if (!file.type.match('image.*')) {
      setError('請選擇圖片檔案');
      return;
    }

    // 限制檔案大小 (例如 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('圖片大小不能超過 2MB');
      return;
    }

    setSelectedFile(file);

    // 建立預覽
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('請選擇一個頭像圖片');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('http://localhost:5000/api/auth/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '頭像上傳失敗');
      }

      // 更新本地用戶數據
      setUser(prevUser => ({
        ...prevUser,
        avatar: data.data.avatar
      }));

      // 更新 localStorage 中的用戶顯示信息
      try {
        const userDisplay = JSON.parse(localStorage.getItem('userDisplay'));
        if (userDisplay) {
          userDisplay.avatar = data.data.avatar;
          localStorage.setItem('userDisplay', JSON.stringify(userDisplay));

          // 觸發自定義事件通知其他組件頭像已更新
          window.dispatchEvent(new Event('avatarUpdated'));
        }
      } catch (err) {
        console.error('更新本地存儲失敗:', err);
      }

      setMessage('頭像上傳成功');
      setSelectedFile(null);
    } catch (error) {
      console.error('頭像上傳錯誤:', error);
      setError(error.message || '頭像上傳失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 原有的提交表單功能
  const handleSubmit = async (e) => {
    // 保留現有邏輯
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新失敗');
      }

      const data = await response.json();
      setUser(data.data);

      // 更新本地存儲的用戶顯示資訊
      const userDisplay = JSON.parse(localStorage.getItem('userDisplay') || '{}');
      localStorage.setItem('userDisplay', JSON.stringify({
        ...userDisplay,
        name: formData.name,
        email: formData.email
      }));

      setSuccessMessage('個人資料已更新成功');
      setIsEditing(false);
    } catch (err) {
      console.error('更新個人資料錯誤:', err);
      setError(err.message || '無法更新個人資料，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const serverUrl = 'http://localhost:5000';
  const defaultAvatarUrl = user?.avatar || null;
  const avatarDisplay = previewUrl || defaultAvatarUrl;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">個人資料</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            編輯資料
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* 頭像上傳區域 */}
      <div className="mb-8 p-4 border border-gray-200 rounded-md">
        <h3 className="text-lg font-medium mb-4">頭像設定</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 顯示當前頭像或預覽 */}
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="預覽頭像" className="h-full w-full object-cover" />
            ) : user?.avatar ? (
              <img
                src={user.avatar} // 直接使用Base64字串
                alt="當前頭像"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                }}
              />
            ) : (
              <div className="h-full w-full bg-[#4a5332] text-white flex items-center justify-center text-xl">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="avatar"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                選擇圖片
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {selectedFile ? selectedFile.name : '未選擇檔案'}
              </span>
            </div>
            <button
              onClick={handleAvatarUpload}
              disabled={!selectedFile || isSubmitting}
              className={`px-4 py-2 rounded-md text-white text-sm ${!selectedFile || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#4a5332] hover:bg-[#3c4c31]'
                }`}
            >
              {isSubmitting ? '上傳中...' : '上傳頭像'}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              建議使用正方形圖片，支援 JPG、PNG 格式，檔案大小不超過 2MB
            </p>
          </div>
        </div>
      </div>

      {/* 保留原有的表單部分 */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* 姓名 */}
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="name">姓名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a5332]"
              required
              disabled={!isEditing}
            />
          </div>

          {/* 電子信箱 */}
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">電子信箱</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a5332]"
              required
              disabled={!isEditing}
            />
          </div>

          {/* 電話 */}
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="phone">電話</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a5332]"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* 編輯模式下的按鈕 */}
        {isEditing && (
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4a5332] text-white rounded hover:bg-[#3c4c31] disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? '儲存中...' : '儲存變更'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || ''
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              disabled={loading}
            >
              取消
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
