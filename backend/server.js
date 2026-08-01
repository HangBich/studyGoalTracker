require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const goalRoutes = require('./src/routes/goalRoutes');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();

// ===== CHUOI MIDDLEWARE - THU TU CO Y NGHIA =====

// 1. CORS: bat buoc vi frontend (Vercel) va backend (Render) khac domain.
// Chi cho phep domain frontend cua minh, KHONG dung origin: '*' khi da co auth.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));

// 2. Parse JSON body
app.use(express.json());

// Health check - de kiem tra service con song sau khi deploy
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);

// 4. Khong khop route nao -> 404
app.use(notFound);

// 5. Error handler dat SAU CUNG. Moi next(err) o tren deu roi vao day.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server chay tai cong ${PORT}`));
});
