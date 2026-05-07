import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Heart, Download, Plus } from 'lucide-react';
import api from '../utils/api';
import UploadModal from '../components/UploadModal';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myWorks, setMyWorks] = useState([]);
  const [likedWorkflows, setLikedWorkflows] = useState([]);
  const [stats, setStats] = useState({
    works: 0,
    likes: 0,
    views: 0,
    followers: 0
  });
  const [activeTab, setActiveTab] = useState('works');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // 获取用户信息
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      // 获取用户作品
      const worksRes = await api.get('/works');
      const userWorks = worksRes.data.filter(w => w.user_id === userRes.data.id);
      setMyWorks(userWorks);

      // 计算统计数据
      const totalLikes = userWorks.reduce((sum, w) => sum + (w.likes || 0), 0);
      const totalViews = userWorks.reduce((sum, w) => sum + (w.views || 0), 0);

      setStats({
        works: userWorks.length,
        likes: totalLikes,
        views: totalViews,
        followers: 1200 // 模拟数据
      });

      // 获取喜欢的工作流（简化版：随机获取一些）
      const workflowsRes = await api.get('/workflows');
      setLikedWorkflows(workflowsRes.data.slice(0, 3));

    } catch (error) {
      console.error('获取用户数据失败:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.username}</h1>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <p className="text-gray-500 text-sm">
                注册时间: {formatDate(user?.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Image}
            label="发布作品"
            value={stats.works}
            color="bg-blue-500"
          />
          <StatCard
            icon={Heart}
            label="获得点赞"
            value={stats.likes}
            color="bg-pink-500"
          />
          <StatCard
            icon={Download}
            label="总浏览量"
            value={stats.views}
            color="bg-purple-500"
          />
          <StatCard
            icon={Plus}
            label="粉丝数"
            value={stats.followers}
            color="bg-green-500"
          />
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('works')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'works'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              我的作品 ({myWorks.length})
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'workflows'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              喜欢的工作流 ({likedWorkflows.length})
            </button>
          </div>

          <div className="p-6 min-h-[400px]">
            {activeTab === 'works' ? (
              myWorks.length === 0 ? (
                <EmptyState
                  icon={Image}
                  title="暂无作品"
                  desc="点击右上角发布你的第一个作品吧！"
                />
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {myWorks.map(work => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </div>
              )
            ) : (
              likedWorkflows.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="暂无喜欢的工作流"
                  desc="去工作流市场发现优质内容吧！"
                />
              ) : (
                <div className="space-y-4">
                  {likedWorkflows.map(workflow => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* 发布按钮 */}
        <button
          onClick={() => setUploadOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={fetchUserData}
      />
    </div>
  );
}

// 子组件
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function WorkCard({ work }) {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <img src={work.media_url} alt={work.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="font-bold text-gray-800 truncate mb-2">{work.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{work.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> {work.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" /> {work.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ workflow }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <img
        src={workflow.thumbnail || 'https://picsum.photos/seed/wf/100/100'}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-bold text-gray-800">{workflow.title}</h4>
        <p className="text-sm text-gray-500 line-clamp-1">{workflow.description}</p>
      </div>
      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
        {workflow.category}
      </span>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      <p className="text-gray-500 mt-1">{desc}</p>
    </div>
  );
}