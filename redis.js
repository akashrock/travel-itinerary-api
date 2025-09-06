// src/redis.js
const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  url: process.env.UPSTASH_REDIS_URL, // <-- direct URL from Upstash
});

client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

client.on('connect', () => {
  console.log('✅ Redis connected');
});

// Connect with retry logic
const connectRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('❌ Redis connection failed, retrying in 5s...', err.message);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

module.exports = client;
