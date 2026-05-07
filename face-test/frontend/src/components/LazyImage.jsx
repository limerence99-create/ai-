import { useState, useEffect, useRef } from 'react';

export default function LazyImage({
  src,
  alt = '',
  className = '',
  placeholder = 'blur', // 'blur' | 'color' | 'none'
  fallback = 'https://picsum.photos/seed/placeholder/600/400',
  onLoad,
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // 提前 100px 加载
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
    onError?.();
  };

  // 占位符样式
  const getPlaceholderStyle = () => {
    if (placeholder === 'blur') {
      return 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse';
    } else if (placeholder === 'color') {
      return 'bg-gray-200';
    }
    return '';
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* 占位符 */}
      {!loaded && (
        <div className={`absolute inset-0 ${getPlaceholderStyle()}`}>
          {placeholder === 'none' && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 真实图片 */}
      {inView && (
        <img
          src={error ? fallback : src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${error ? 'hidden' : ''}`}
        />
      )}

      {/* 加载失败占位 */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">图片加载失败</span>
        </div>
      )}
    </div>
  );
}