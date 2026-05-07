import { useEffect, useRef, useState } from 'react';

export default function InfiniteScroll({
  children,
  loadMore,
  hasMore,
  loading = false,
  threshold = 100, // 距离底部多少像素时触发
  initialLoad = true,
}) {
  const observerTarget = useRef(null);
  const [isLoading, setIsLoading] = useState(initialLoad);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, threshold]);

  return (
    <>
      {children}

      {/* 加载指示器 */}
      <div ref={observerTarget} className="py-8 text-center">
        {loading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
            <span className="text-gray-600">加载中...</span>
          </div>
        )}

        {!hasMore && (
          <p className="text-gray-500 text-sm">
            {isLoading ? '已经到底了' : '没有更多数据了'}
          </p>
        )}
      </div>
    </>
  );
}

// 使用示例 Hook
export function useInfiniteScroll(apiFunction, options = {}) {
  const { pageSize = 10 } = options;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await apiFunction(page, pageSize);
      const newData = response.data || [];

      setData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === pageSize);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, hasMore, loadMore: loadData, refresh };
}