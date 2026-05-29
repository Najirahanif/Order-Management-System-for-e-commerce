import Redis from 'ioredis';

async function testRedis() {
  const redis = new Redis({
    sentinels: [
      { host: '127.0.0.1', port: 26379 },
      { host: '127.0.0.1', port: 26380 },
      { host: '127.0.0.1', port: 26381 }
    ],
    name: 'mymaster',
    role: 'master',
    connectTimeout: 10000,
    retryStrategy: (times) => {
      console.log(`Retry attempt: ${times}`);
      return Math.min(times * 100, 3000);
    },
    sentinelRetryStrategy: (times) => {
      console.log(`Sentinel retry attempt: ${times}`);
      return Math.min(times * 100, 3000);
    }
  });

  let counter = 0;
  
  redis.on('connect', () => {
    console.log('✅ Connected to Redis Sentinel');
  });

  redis.on('ready', () => {
    console.log('✅ Redis is ready!');
  });

  redis.on('error', (err) => {
    console.log('❌ Redis error:', err.message);
  });

  setInterval(async () => {
    try {
      const timestamp = Date.now();
      await redis.set(`failover-test:${counter}`, timestamp);
      console.log(`✅ [${new Date().toLocaleTimeString()}] Write SUCCESS - Key: failover-test:${counter}, Value: ${timestamp}`);
      counter++;
    } catch (err) {
      console.log(`❌ [${new Date().toLocaleTimeString()}] Write FAILED - ${err.message}`);
    }
  }, 1000);
}

testRedis();
