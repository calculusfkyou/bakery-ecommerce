import axios from 'axios';

// 創建具有授權功能的axios實例
const authAxios = axios.create({
  baseURL: '/api',
  withCredentials: true // 允許跨域請求攜帶cookies
});

// 請求攔截器，為每個請求添加授權頭
authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // 確認 token 是否存在
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 響應攔截器，處理未授權錯誤
authAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 登錄已過期，清除本地存儲並跳轉至登錄頁
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authAxios;
