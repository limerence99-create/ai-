import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, CheckCircle2, ImagePlus } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../components/Toast';

export default function Generation() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('写实');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return addToast('请输入提示词', 'warning');

    setStatus('queued');
    setProgress(0);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.post('/generate/submit', {
        prompt,
        style,
        user_id: user.id || 1
      });
      setJobId(res.data.jobId);
      setStatus('processing');
      addToast('任务已提交，正在排队生成...', 'info');
    } catch (err) {
      setStatus('error');
      addToast('提交失败，请重试', 'error');
    }
  };

  useEffect(() => {
    if (!jobId || status === 'completed') return;
    const timer = setInterval(async () => {
      try {
        const res = await api.get(`/generate/status/${jobId}`);
        setProgress(res.data.progress);
        if (res.data.status === 'completed') {
          setStatus('completed');
          setResultUrl(res.data.result_url);
          addToast('🎉 生成成功！已自动保存至作品广场', 'success');
          clearInterval(timer);
        }
      } catch (err) {
        clearInterval(timer);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [jobId, status]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI 创作工作台</h1>
              <p className="text-gray-500">输入提示词，AI 将为你生成专属作品</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">创意提示词</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：赛博朋克风格的未来城市，霓虹灯光，雨夜，8k分辨率..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32"
                disabled={status === 'processing'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">艺术风格</label>
              <div className="flex flex-wrap gap-3">
                {['写实', '动漫', '油画', '3D渲染', '水墨'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      style === s
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'processing' || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI 创作中... {progress}%
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  开始生成
                </>
              )}
            </button>
          </form>

          {status === 'processing' && (
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>生成进度</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-gray-500 mt-3 text-sm">
                {progress < 30 ? '正在解析提示词...' : progress < 70 ? 'AI 模型计算中...' : '正在渲染高清细节...'}
              </p>
            </div>
          )}

          {status === 'completed' && resultUrl && (
            <div className="mt-8 animate-fade-in">
              <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>生成完成！已保存至作品广场</span>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg group">
                <img src={resultUrl} alt="AI Result" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/gallery')}
                    className="px-6 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100"
                  >
                    查看作品广场
                  </button>
                  <button
                    onClick={() => window.open(resultUrl, '_blank')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    下载原图
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}