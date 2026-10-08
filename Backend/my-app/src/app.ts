import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';

const app: Application = express();

// 1. Ẩn thông tin framework (X-Powered-By) và thêm các HTTP security headers
app.disable('x-powered-by'); // Tắt header "X-Powered-By: Express"
app.use(helmet());           // Thiết lập Content-Security-Policy, HSTS, X-Content-Type-Options,...

// 2. Cấu hình CORS an toàn với Whitelist nguồn gọi
const allowedOrigins = [
  'http://localhost:3000',               // Frontend local (Next.js / React / Vite)
  'http://localhost:5173',
  process.env.CLIENT_URL,                 // Domain production (VD: https://yourdomain.com)
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Cho phép các request không có origin (như cURL, Mobile apps, Postman) hoặc nằm trong whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Origin not allowed'));
    }
  },
  credentials: true, // Bật nếu dùng cookie / token xác thực qua header credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// 3. Body parsers với giới hạn kích thước payload (tránh tấn công DoS/OOM)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Route Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running smoothly' });
});

export default app;