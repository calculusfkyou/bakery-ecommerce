import { User } from '../models/userModel.js';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 獲取所有用戶 (僅限管理員)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    console.error('獲取所有用戶錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 獲取特定用戶 (僅限管理員)
export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '找不到用戶'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('獲取用戶錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 創建用戶 (僅限管理員)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, isVerified } = req.body;

    // 檢查郵件是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: '此電子郵件已被註冊'
      });
    }

    // 密碼加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 創建用戶
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user',
      isVerified: isVerified || false
    });

    // 排除密碼後回傳
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    res.status(201).json({
      status: 'success',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('創建用戶錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 更新用戶 (僅限管理員)
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isVerified, password } = req.body;
    const userId = req.params.id;

    // 檢查用戶是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '找不到用戶'
      });
    }

    // 檢查電子郵件是否已被其他用戶使用
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: '此電子郵件已被其他用戶使用'
        });
      }
    }

    // 準備要更新的數據
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      role: role || user.role,
      isVerified: isVerified !== undefined ? isVerified : user.isVerified
    };

    // 如果提供了新密碼，則加密
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // 更新用戶
    await User.update(updateData, { where: { id: userId } });

    // 獲取更新後的用戶數據
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    console.error('更新用戶錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 删除用戶 (僅限管理員)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 檢查用戶是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '找不到用戶'
      });
    }

    // 防止删除預設管理員
    if (user.email === 'admin@example.com') {
      return res.status(403).json({
        status: 'fail',
        message: '無法删除預設管理員帳號'
      });
    }

    // 删除用戶
    await User.destroy({ where: { id: userId } });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('删除用戶錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

export const register = async (req, res) => {
  console.log('收到註冊請求:', req.body);
  const { name, email, password, phone } = req.body;

  // 開始一個事務
  const transaction = await sequelize.transaction();

  try {
    // 檢查郵件是否已存在 (在事務中)
    const existingUser = await User.findOne({
      where: { email },
      transaction
    });

    if (existingUser) {
      await transaction.rollback(); // 回滾事務
      return res.status(409).json({
        status: 'fail',
        message: '此電子郵件已被註冊'
      });
    }

    // 密碼加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 創建用戶 (在事務中)
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    }, { transaction });

    if (!user) {
      await transaction.rollback(); // 回滾事務
      return res.status(400).json({
        status: 'fail',
        message: 'User registration failed',
      });
    }

    // 提交事務
    await transaction.commit();

    console.log('用戶創建成功:', user.toJSON());
    return res.status(201).json({
      status: 'success',
      message: 'User registered success',
    });
  } catch (error) {
    // 發生錯誤時回滾事務
    await transaction.rollback();

    console.error('註冊處理錯誤:', error);

    // 提供更具體的錯誤訊息
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        message: '此電子郵件已被註冊'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Database error: ' + (error.message || '未知錯誤')
    });
  }
};

// 登入函數也需要加強安全性
export const login = async (req, res) => {
  console.log('收到登入請求:', req.body);
  const { email, password, rememberMe = false } = req.body;

  // 開始一個事務 (即使是讀取操作，也能確保資料一致性)
  const transaction = await sequelize.transaction();

  try {
    // 尋找用戶
    const user = await User.findOne({
      where: { email },
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(401).json({
        status: 'fail',
        message: '帳號或密碼錯誤' // 使用通用訊息避免洩露用戶存在與否
      });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await transaction.rollback();
      return res.status(401).json({
        status: 'fail',
        message: '帳號或密碼錯誤'
      });
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file',
      {
        expiresIn: rememberMe ? '30d' : '24h'
      }
    );

    // 設置 HTTP-only Cookie
    res.cookie('token', token, {
      httpOnly: true, // 重要：防止 JavaScript 訪問
      secure: process.env.NODE_ENV === 'production' || true, // 生產環境下要求 HTTPS
      sameSite: 'None', // 防止 CSRF 攻擊
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30天或1天
      path: '/'
    });

    // 提交事務
    await transaction.commit();

    // 移除密碼再返回用戶資訊
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    console.log('用戶登入成功:', userWithoutPassword);

    return res.status(200).json({
      status: 'success',
      message: '登入成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    // 發生錯誤時回滾事務
    await transaction.rollback();

    console.error('登入處理錯誤:', error);

    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，請稍後再試',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const logout = (req, res) => {
  // 清除認證 cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // 立即過期
    path: '/'
  });

  return res.status(200).json({
    status: 'success',
    message: '登出成功'
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '找不到用戶'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 更新個人資料
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // 檢查電子郵件是否已被使用
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: '此電子郵件已被其他用戶使用'
        });
      }
    }

    // 更新用戶資料
    await User.update(
      { name, email, phone },
      { where: { id: req.user.id } }
    );

    // 獲取更新後的用戶資料
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    console.error('更新個人資料錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

// 上傳頭像的功能
export const uploadAvatar = async (req, res) => {
  try {
    // 確認有檔案上傳
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: '請選擇一個頭像圖片'
      });
    }

    // 取得用戶ID
    const userId = req.user.id;

    // 讀取檔案內容並轉換成Base64
    const fileBuffer = req.file.buffer; // 若使用multer的memoryStorage()
    const fileBase64 = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // 更新資料庫，直接存儲Base64編碼的圖片
    await User.update(
      { avatar: fileBase64 },
      { where: { id: userId } }
    );

    // 查詢更新後的用戶資料
    const updatedUser = await User.findByPk(userId);

    // 回傳成功訊息與更新後的用戶資料
    return res.status(200).json({
      status: 'success',
      message: '頭像上傳成功',
      data: {
        avatar: fileBase64, // 直接返回Base64編碼的圖片
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar, // 這已經是Base64編碼的圖片
          role: updatedUser.role
        }
      }
    });
  } catch (error) {
    console.error('頭像上傳錯誤:', error);
    return res.status(500).json({
      status: 'error',
      message: '頭像上傳失敗，請稍後再試'
    });
  }
};

// 變更密碼
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 獲取用戶
    const user = await User.findByPk(req.user.id);

    // 驗證當前密碼
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: '當前密碼不正確'
      });
    }

    // 加密新密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新密碼
    await User.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );

    res.status(200).json({
      status: 'success',
      message: '密碼已成功更新'
    });
  } catch (error) {
    console.error('更新密碼錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    });
  }
};

