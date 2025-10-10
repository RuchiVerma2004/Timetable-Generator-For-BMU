const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import database connection
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');      // Make sure this is included
const professorRoutes = require('./routes/professors');  // Make sure this is included
const adminRoutes = require('./routes/admin');
const timetableRoutes = require('./routes/timetable');

// Connect to database
connectDatabase();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);      // This should be here
app.use('/api/professors', professorRoutes);  // This should be here
app.use('/api/admin', adminRoutes);
app.use('/api/timetable', timetableRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BMU TimeMaster API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📚 BMU TimeMaster Backend API`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Student routes: http://localhost:${PORT}/api/students`);
  console.log(`👨‍🏫 Professor routes: http://localhost:${PORT}/api/professors`);
});