import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js'; // 引入資料庫連線
import newsRoutes from './routes/newsRoutes.js'; // 引入新聞路由
import storeRoutes from './routes/storeRoutes.js'; // 引入門市路由
import authRoutes from './routes/authRoutes.js'; // 引入認證路由
import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true  // 在生產環境中允許任何來源
    : 'http://localhost:5173', // 開發環境限制
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); // 提供靜態檔案服務

// app.get('/', (req, res) => {
//   res.send('伺服器運行中 🚀');
// });

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from MoMo Backend! We\'ll go from here now.' });
});

app.post('/api/hello', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello ${name} from MoMo Backend!` });
});

// 添加新聞路由
app.use('/api/news', newsRoutes);

// 添加門市路由
app.use('/api/stores', storeRoutes);

// 添加認證路由
app.use('/api/auth', authRoutes);

// 添加訂單路由
app.use('/api/orders', orderRoutes);

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');

    await sequelize.sync({ alter: false });
    console.log('Tables sync successfully');
  } catch (error) {
    console.log('Unable to connect to MySQL:', error);
  }
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
