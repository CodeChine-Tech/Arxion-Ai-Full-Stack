import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import corsMiddleware from './middleware/cors.js';
import apiLimiter from './middleware/rateLimit.js';

import apiRoutes from './routes/api.js';
import keyRoutes from './routes/keys.js';
import contactRoutes from './routes/contact.js';

const app = express();

// ✅ Basic middlewares
app.use(corsMiddleware);
app.use(express.json());

// ✅ Apply rate limit ONLY to API
app.use('/api/v1', apiLimiter);

// ✅ FIXED ROUTES (IMPORTANT)
app.use('/api/v1', apiRoutes);
app.use('/api/v1', keyRoutes);
app.use('/api/v1', contactRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server running 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;