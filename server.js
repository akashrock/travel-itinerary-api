// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/itineraries', require('./src/routes/itinerary'));

// ---------------------
// MongoDB Connection
// ---------------------
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed, retrying in 5s...', err.message);
    setTimeout(connectMongo, 5000);
  }
};

// ---------------------
// Redis Connection
// ---------------------
const redisClient = require('./src/redis');

// ---------------------
// Start server only after DBs are ready
// ---------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongo();
  await redisClient.connect();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, redisClient };

