import { useState, useEffect } from 'react';

/**
 * 防抖 Hook
 * @param {any} value - 需要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {any} - 防抖后的值
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖回调 Hook
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 防抖后的回调
 */
export function useDebounceCallback(callback, delay = 300) {
  const [debouncedCallback, setDebouncedCallback] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay]);

  return debouncedCallback;
}

export default useDebounce;