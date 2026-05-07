import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import WorkflowCard from '../components/WorkflowCard';
import api from '../utils/api';

export default function WorkflowMarket() {
  const [workflows, setWorkflows] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['图像生成', '视频处理', '音频处理', '3D建模', '文本生成'];

  useEffect(() => {
    fetchWorkflows();
  }, [category]);

  const fetchWorkflows = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await api.get('/workflows', { params });
      setWorkflows(response.data);
    } catch (error) {
      console.error('获取工作流失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchWorkflows();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">工作流市场</h1>
          <p className="text-gray-600">探索数千个AI工作流，提升你的创作效率</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索工作流..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">全部分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                搜索
              </button>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onRefresh={fetchWorkflows}
              />
            ))}
          </div>
        )}

        {!loading && workflows.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">暂无工作流</p>
          </div>
        )}
      </div>
    </div>
  );
}