// src/config/redis/redis.ts
import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export const redisConnect = () => {
  const redis = new Redis({
    host: process.env.REDIS_SERVER_HOST || "localhost",
    port: 6379,
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err:any) => {
    console.error("Redis error:", err);
  });

  return redis;
};

// sentinal configuration check 
// uncomment and check with terminals running  and comment general redis
// make the redis master to run in the ui and check the terminal mentioned in the file
// export const redisConnect = async (): Promise<Redis> => {
//   // Return existing instance if ready
//   if (redisInstance && redisInstance.status === 'ready') {
//     console.log('✅ Using existing Redis connection');
//     return redisInstance;
//   }

//   console.log('🔗 Connecting to Redis Sentinel...');

//   return new Promise((resolve, reject) => {
//     const redis = new Redis({
//       sentinels: [
//         { host: 'redis-sentinel-1', port: 26379 },
//         { host: 'redis-sentinel-2', port: 26379 },
//         { host: 'redis-sentinel-3', port: 26379 }
//       ],
//       name: 'mymaster',
//       role: 'master',
//       connectTimeout: 10000,
//       retryStrategy: (times: number) => {
//         console.log(`Retry attempt: ${times}`);
//         return Math.min(times * 100, 3000);
//       },
//       sentinelRetryStrategy: (times: number) => {
//         console.log(`Sentinel retry attempt: ${times}`);
//         return Math.min(times * 100, 3000);
//       }
//     });

//     let resolved = false;

//     redis.on('ready', () => {
//       if (!resolved) {
//         resolved = true;
//         redisInstance = redis;
//         console.log('✅ Redis is ready!');
//         resolve(redis);
//       }
//     });

//     redis.on('error', (err: Error) => {
//       console.error('❌ Redis error:', err.message);
//       if (!resolved) {
//         resolved = true;
//         reject(err);
//       }
//     });

//     setTimeout(() => {
//       if (!resolved) {
//         resolved = true;
//         reject(new Error('Redis connection timeout after 10 seconds'));
//       }
//     }, 10000);
//   });
// };

export default { redisConnect };