import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const isAuthenticated = (req, res, next) => {
  try {
    // 從 cookie 或 Authorization header 取得 token
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: '請先登入' });
    }

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: '認證失敗', error: error.message });
  }
};

export const isAdmin = (req, res, next) => {
  // 添加特定管理員帳號檢查
  if (req.user && (req.user.role === 'admin' || req.user.email === 'admin@example.com')) {
    next();
  } else {
    return res.status(403).json({ message: '需要管理員權限' });
  }
};

// 用於測試環境的模擬認證 (模擬已登入的管理員)
export const mockAdminAuth = (req, res, next) => {
  req.user = {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin'
  };
  next();
};

// 保護路由，要求用戶必須登入
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token; // 從 cookie 獲取令牌

    // 如果 cookie 中沒有，嘗試從請求標頭獲取
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 沒有令牌則拒絕請求
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: '您未登入，請先登入'
      });
    }

    // 驗證令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file');

    // 特別檢查管理員帳號
    if (decoded.email === 'admin@example.com') {
      req.user = {
        ...decoded,
        role: 'admin',
        isAdmin: true
      };
      return next();
    }

    // 檢查用戶是否存在
    try {
      const currentUser = await User.findByPk(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          status: 'fail',
          message: '此令牌的用戶已不存在'
        });
      }

      req.user = {
        ...decoded,
        role: currentUser.role,
        isAdmin: currentUser.role === 'admin'
      };
      next();
    } catch (error) {
      // 資料庫連接失敗但仍需檢查是否為管理員
      if (decoded.email === 'admin@example.com') {
        req.user = {
          ...decoded,
          role: 'admin',
          isAdmin: true
        };
        return next();
      }
      throw error;
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: '無效的令牌'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: '令牌已過期，請重新登入'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 針對特定角色限制路由訪問
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 確保 req.user 存在（應由 protect 中間件設置）
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: '請先登入'
      });
    }

    // 檢查用戶角色是否在允許的角色列表中
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: '您沒有權限執行此操作'
      });
    }

    // 如果角色有效，繼續下一步
    next();
  };
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return res.status(200).json({
    status: 'success',
    message: '登出成功'
  });
};
