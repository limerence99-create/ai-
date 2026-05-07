import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000, // 15秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求队列（用于重试）
const requestQueue = new Map();

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 自动携带 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳
    config.metadata = { startTime: new Date() };

    // 显示加载动画（可选）
    if (config.showLoading !== false) {
      // 这里可以触发全局 loading
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 记录请求耗时
    if (response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`[API] ${response.config.url} - ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const config = error.config;

    // 网络错误或 5xx 服务器错误，自动重试最多 2 次
    if (
      (error.code === 'ERR_NETWORK' ||
       (error.response && error.response.status >= 500)) &&
      !config._retry
    ) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 2) {
        console.log(`[Retry] ${config.url} - Attempt ${config._retryCount}`);
        // 指数退避：第1次等1秒，第2次等2秒
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, config._retryCount - 1) * 1000)
        );
        return api(config);
      }
    }

    // 401 未授权，清除登录状态
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 如果不在登录页，跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    }

    // 403 禁止访问
    if (error.response?.status === 403) {
      console.error('权限不足');
    }

    // 500 服务器错误
    if (error.response?.status === 500) {
      console.error('服务器错误，请稍后重试');
    }

    return Promise.reject(error);
  }
);

// 导出常用 HTTP 方法
export default api;

// 导出便捷方法
export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const del = (url, config) => api.delete(url, config);
export const upload = (url, formData, config) =>
  api.post(url, formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
  });