import { useState, useEffect } from 'react';
import WorkCard from '../components/WorkCard';
import api from '../utils/api';

export default function WorkGallery() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await api.get('/works');
      setWorks(response.data);
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">作品广场</h1>
          <p className="text-gray-600">欣赏社区创作的精美AI作品</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : works.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无作品</h3>
            <p className="text-gray-500">数据正在赶来，快去创作吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}