// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const redis = require('redis');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// Routes
// ---------------------
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/itineraries', require('./src/routes/itinerary'));

// ---------------------
// MongoDB Connection
// ---------------------
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // removed deprecated options
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed, retrying in 5s...', err.message);
    setTimeout(connectMongo, 5000);
  }
};

// ---------------------
// Redis Connection
// ---------------------
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis connection failed, retrying in 5s...', err.message);
    setTimeout(connectRedis, 5000);
  }
};

// ---------------------
// Start server only after DBs are ready
// ---------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongo();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();

// Export Redis client if needed elsewhere
module.exports = redisClient;
