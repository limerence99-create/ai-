import { useState, useEffect } from 'react';
import { Heart, Download, Eye, Image, TrendingUp, Loader2, LayoutDashboard } from 'lucide-react';
import api from '../utils/api';
import UploadModal from '../components/UploadModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('works');
  const [works, setWorks] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      if (activeTab === 'works') {
        const allWorks = await api.get('/works');
        setWorks(allWorks.data.filter(w => w.user_id === user.id));
      } else if (activeTab === 'likes') {
        const workflows = await api.get('/workflows');
        setLikes(workflows.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'works', label: '我的作品', icon: Image },
    { id: 'likes', label: '喜欢的工作流', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 头部统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Image} label="发布作品" value={works.length} color="bg-blue-500" />
          <StatCard icon={Heart} label="获得点赞" value={works.reduce((a, b) => a + (b.likes || 0), 0)} color="bg-pink-500" />
          <StatCard icon={Eye} label="总浏览量" value={works.reduce((a, b) => a + (b.views || 0), 0)} color="bg-purple-500" />
          <StatCard icon={TrendingUp} label="粉丝数" value="1.2k" color="bg-green-500" />
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90"
            >
              + 发布新作品
            </button>
          </div>

          <div className="p-6 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
            ) : activeTab === 'works' ? (
              works.length === 0 ? (
                <EmptyState icon={Image} title="暂无作品" desc="点击右上角发布你的第一个作品吧！" />
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {works.map(w => (
                    <div key={w.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <img src={w.media_url} alt={w.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 truncate">{w.title}</h4>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {w.likes || 0}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {w.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              likes.length === 0 ? (
                <EmptyState icon={Heart} title="暂无喜欢" desc="去工作流市场发现优质内容吧！" />
              ) : (
                <div className="space-y-4">
                  {likes.map(wf => (
                    <div key={wf.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img src={wf.thumbnail || 'https://picsum.photos/seed/wf/100/100'} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{wf.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{wf.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">{wf.category}</span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

// 子组件
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} text-white`}><Icon className="w-6 h-6" /></div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
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