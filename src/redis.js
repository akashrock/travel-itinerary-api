// src/redis.js
const redis = require('redis');

let client;

// Use UPSTASH_REDIS_URL if available, else fallback to local Redis
if (process.env.UPSTASH_REDIS_URL) {
  client = redis.createClient({ url: process.env.UPSTASH_REDIS_URL });
} else {
  const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
  const REDIS_PORT = process.env.REDIS_PORT || 6379;
  client = redis.createClient({
    socket: { host: REDIS_HOST, port: REDIS_PORT },
  });
}

client.on('connect', () => console.log('✅ Redis connected'));
client.on('error', (err) => console.error('❌ Redis error:', err));

module.exports = client;
