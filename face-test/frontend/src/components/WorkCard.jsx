import { Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import api from '../utils/api';

export default function WorkCard({ work }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(work?.likes || 0);

  // 防御性编程：如果 work 为空，显示占位
  if (!work) {
    return null;
  }

  const handleLike = async () => {
    try {
      await api.post(`/works/${work.id}/like`);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover fade-in">
      <div className="relative">
        {work.media_type === 'image' ? (
          <img
            src={work.media_url}
            alt={work.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/seed/placeholder/600/400';
            }}
          />
        ) : (
          <video
            src={work.media_url}
            controls
            className="w-full h-64"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{work.title || 'Untitled'}</h3>
        <p className="text-gray-600 text-sm mb-3">{work.description || ''}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>@{work.author_name || 'Unknown'}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {work.views || 0}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              {likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}