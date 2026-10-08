import dotenv from 'dotenv';
dotenv.config(); // Nạp các biến trong file .env trước tiên

import app from './app';
import { connectDB } from './config/db.config'; // Đảm bảo đường dẫn tới file db.config đúng

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Kết nối Database trước khi bật server nhận request
    await connectDB();

    // 2. Bắt đầu lắng nghe request
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();