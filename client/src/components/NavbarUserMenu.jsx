import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function NavbarUserMenu() {
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 頁面載入時檢查登入狀態
    const checkLoginStatus = () => {
      try {
        // 從 localStorage 獲取用戶資訊
        const userJSON = localStorage.getItem('userDisplay');
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          setUser(userData);
          setImageError(false); // 重置圖片錯誤狀態
        }
      } catch (error) {
        console.error('獲取用戶資訊失敗:', error);
      }
    };

    checkLoginStatus();

    // 監聽 storage 事件，當其他頁面登入/登出時更新狀態
    window.addEventListener('storage', checkLoginStatus);

    // 監聽自定義的頭像更新事件
    window.addEventListener('avatarUpdated', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('avatarUpdated', checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // 發送登出請求
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        // 清除本地存儲
        localStorage.removeItem('userDisplay');

        // 重置用戶狀態
        setUser(null);

        // 導航到首頁
        navigate('/');
      } else {
        console.error('登出失敗');
      }
    } catch (error) {
      console.error('登出請求失敗:', error);
    }
  };

  // 如果用戶未登入，顯示註冊/登入按鈕
  // 如果用戶未登入，顯示註冊/登入按鈕
  if (!user) {
    return (
      <>
        <a href="/register" className="text-sm text-gray-600 hover:text-[#8B5A2B]">註冊</a>
        <a href="/login" className="text-sm bg-[#8B5A2B] text-white px-4 py-2 rounded transition-colors hover:bg-[#A67C52]">登入</a>
      </>
    );
  }

  // 用戶已登入，顯示用戶頭像
  return (
    <div className="relative group">
      <Link to="/profile" className="flex items-center space-x-2">
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
      </Link>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B]">個人資料</Link>
        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B]">我的訂單</Link>
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
