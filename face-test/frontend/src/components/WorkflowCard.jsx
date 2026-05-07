import { Download, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import api from '../utils/api';

export default function WorkflowCard({ workflow }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(workflow?.likes || 0);

  // 防御性编程
  if (!workflow) {
    return null;
  }

  const handleLike = async () => {
    try {
      await api.post(`/workflows/${workflow.id}/like`);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await api.post(`/workflows/${workflow.id}/download`);
      alert('工作流下载成功！');
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover border border-gray-100 fade-in">
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-purple-100 overflow-hidden">
        {workflow.thumbnail ? (
          <>
            <img
              src={workflow.thumbnail}
              alt={workflow.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/seed/placeholder/400/300';
              }}
            />
            <div className="absolute inset-0 card-image-overlay"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🎨</span>
          </div>
        )}
        {workflow.price > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ¥{workflow.price}
          </div>
        )}
        {workflow.price === 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            免费
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
          {workflow.title || 'Untitled'}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {workflow.description || ''}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {workflow.category && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
              {workflow.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {workflow.author_name ? workflow.author_name.charAt(0).toUpperCase() : '@'}
            </span>
            By {workflow.author_name || 'Unknown'}
          </span>
          <span className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            {workflow.downloads || 0}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likes}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all btn-gradient font-medium"
          >
            {workflow.price > 0 ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>购买</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>下载</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}