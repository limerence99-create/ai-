// 简单的内存缓存
const cache = new Map();

function setCache(key, value, ttl = 60000) { // 默认 1 分钟
  const expiry = Date.now() + ttl;
  cache.set(key, { value, expiry });
}

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  // 检查是否过期
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

function deleteCache(key) {
  cache.delete(key);
}

function clearCache() {
  cache.clear();
}

// 缓存中间件
function cacheMiddleware(ttl = 60000) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = req.originalUrl || req.url;
    const cached = getCache(key);

    if (cached) {
      return res.json(cached);
    }

    // 覆盖 res.json 方法
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      setCache(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
}

// 定时清理过期缓存
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiry) {
      cache.delete(key);
    }
  }
}, 60000); // 每分钟清理一次

module.exports = {
  setCache,
  getCache,
  deleteCache,
  clearCache,
  cacheMiddleware,
};