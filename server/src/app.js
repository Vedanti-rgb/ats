const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/ats', require('./routes/atsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Get Resume AI API' });
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
