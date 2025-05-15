import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function NavbarUserMenu() {
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 登入狀態檢查
    const checkLoginStatus = () => {
      try {
        const userJSON = localStorage.getItem('userDisplay');
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          setUser(userData);
          setImageError(false);
        }
      } catch (error) {
        console.error('獲取用戶資訊失敗:', error);
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('avatarUpdated', checkLoginStatus);
    window.addEventListener('userLoggedOut', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('avatarUpdated', checkLoginStatus);
      window.removeEventListener('userLoggedOut', checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      // 清除所有本地儲存的資料
      localStorage.removeItem('userDisplay');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('tokenExpiry');

      setUser(null);

      window.dispatchEvent(new Event('userLoggedOut'));
      window.location.reload();
      navigate('/');
    } catch (error) {
      console.error('登出請求失敗:', error);
      localStorage.removeItem('userDisplay');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('tokenExpiry');
      setUser(null);
      window.location.reload();
    }
  };

  // 如果用戶未登入，顯示註冊/登入按鈕
  if (!user) {
    return (
      <>
        <a href="/register" className="text-sm text-gray-600 hover:text-[#8B5A2B]">註冊</a>
        <a href="/login" className="text-sm bg-[#8B5A2B] text-white px-4 py-2 rounded transition-colors hover:bg-[#A67C52]">登入</a>
      </>
    );
  }

  // 用戶已登入，顯示用戶頭像與懸停下拉選單
  return (
    <div className="relative group">
      {/* 頭像區塊 - 懸停時觸發下拉選單 */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <span className="text-sm text-gray-700">{user.name}</span>
        <div className="h-8 w-8 rounded-full overflow-hidden">
          {user.avatar && !imageError ? (
            <img
              key={user.avatar.substring(0, 20)}
              src={user.avatar}
              alt="用戶頭像"
              className="h-full w-full object-cover"
              onError={() => {
                console.error('頭像載入失敗');
                setImageError(true);
              }}
            />
          ) : (
            <div className="h-full w-full bg-[#8B5A2B] text-white flex items-center justify-center text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* 添加一個透明的區域，連接頭像和下拉選單，避免懸停時選單消失 */}
      <div className="absolute top-full h-3 w-full"></div>

      {/* 下拉選單 - group-hover 控制顯示 */}
      <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B] hover:bg-gray-50"
        >
          個人資料
        </Link>
        <Link
          to="/order-tracking"
          className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B] hover:bg-gray-50"
        >
          訂單追蹤
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          登出
        </button>
      </div>
    </div>
  );
}
