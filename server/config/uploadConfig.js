import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 使用記憶體儲存而非檔案系統
const storage = multer.memoryStorage();

// 設置限制和檔案過濾器
export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 限制2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允許上傳圖片檔案'), false);
    }
  }
});
