const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;
let redis = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  redis.on("error", (error) => {
    console.error("Redis error:", error.message);
  });
}

const getRedis = async () => {
  if (!redis) return null;

  if (redis.status === "wait" || redis.status === "end") {
    await redis.connect();
  }

  return redis;
};

module.exports = getRedis;
