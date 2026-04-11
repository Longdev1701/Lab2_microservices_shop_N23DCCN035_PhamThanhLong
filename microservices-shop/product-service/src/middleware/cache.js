const getRedis = require("../lib/redis");

const PRODUCT_LIST_PREFIX = "products:list:";
const PRODUCT_LIST_TTL_SECONDS = 5 * 60;

const createProductListCacheKey = (req) =>
  `${PRODUCT_LIST_PREFIX}${req.originalUrl || req.url}`;

const cacheProductList = async (req, res, next) => {
  try {
    const redis = await getRedis();
    if (!redis) return next();

    const cacheKey = createProductListCacheKey(req);
    const cachedValue = await redis.get(cacheKey);

    if (cachedValue) {
      return res.json({
        ...JSON.parse(cachedValue),
        cache: true,
      });
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis
          .set(cacheKey, JSON.stringify(body), "EX", PRODUCT_LIST_TTL_SECONDS)
          .catch((error) => console.error("Redis cache set error:", error.message));
      }

      return originalJson(body);
    };

    return next();
  } catch (error) {
    console.error("Redis cache read error:", error.message);
    return next();
  }
};

const clearProductListCache = async () => {
  try {
    const redis = await getRedis();
    if (!redis) return;

    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `${PRODUCT_LIST_PREFIX}*`,
        "COUNT",
        100
      );

      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis cache clear error:", error.message);
  }
};

module.exports = {
  cacheProductList,
  clearProductListCache,
};
