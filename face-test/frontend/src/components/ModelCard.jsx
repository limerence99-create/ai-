import { Download } from 'lucide-react';
import { useToast } from './Toast';

export default function ModelCard({ model }) {
  const { addToast } = useToast();

  const handleDownload = async () => {
    try {
      addToast('开始下载模型...', 'info');

      // 创建隐藏的 a 标签触发下载
      const downloadUrl = `/api/models/${model.id}/download`;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = model.name.replace(/\s+/g, '_') + '.safetensors';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 延迟显示成功（给用户时间看到下载开始）
      setTimeout(() => {
        addToast(`${model.name} 下载已开始！`, 'success');
      }, 1000);

    } catch (error) {
      console.error('下载失败:', error);
      addToast('下载失败，请重试', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-purple-100">
        {model.thumbnail ? (
          <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
        )}
        <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-gray-700">
          {model.type}
        </div>
        {model.size && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded text-xs">
            {model.size} MB
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{model.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{model.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">v{model.version}</span>
          <span className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            {model.downloads || 0}
          </span>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          下载模型
        </button>
      </div>
    </div>
  );
}