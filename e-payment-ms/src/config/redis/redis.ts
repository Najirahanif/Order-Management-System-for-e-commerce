const Redis = require("ioredis");

const redisConnect = () => {
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

module.exports = redisConnect;