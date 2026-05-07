import { useState } from 'react';
import { X, Upload, ImagePlus, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useToast } from './Toast';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      addToast('仅支持图片格式', 'warning');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      addToast('请选择图片并填写标题', 'warning');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('media_type', 'image');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const uploadRes = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await api.post('/works', {
        title,
        description: desc,
        media_url: uploadRes.data.file.url,
        media_type: 'image',
        user_id: user.id || 1
      });
      addToast('🎉 作品发布成功！', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.error || '上传失败', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">发布新作品</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
            ) : (
              <>
                <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">点击或拖拽上传图片</p>
                <p className="text-gray-400 text-sm mt-1">支持 JPG, PNG, WEBP (最大 5MB)</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">作品标题 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="给你的作品起个名字"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">作品描述</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="分享你的创作思路或使用的参数..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">取消</button>
          <button
            onClick={handleUpload}
            disabled={uploading || !file || !title.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> 发布中...</> : <><Upload className="w-4 h-4" /> 发布作品</>}
          </button>
        </div>
      </div>
    </div>
  );
}