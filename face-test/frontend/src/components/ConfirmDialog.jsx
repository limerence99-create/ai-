import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

// 全局确认对话框管理器
let confirmResolver = null;

export function confirm(message, options = {}) {
  return new Promise((resolve) => {
    confirmResolver = resolve;
    window.dispatchEvent(new CustomEvent('showConfirm', {
      detail: { message, options }
    }));
  });
}

export default function ConfirmDialogProvider() {
  const [config, setConfig] = useState(null);

  const handleShowConfirm = (event) => {
    setConfig(event.detail);
  };

  const handleConfirm = (result) => {
    if (confirmResolver) {
      confirmResolver(result);
      confirmResolver = null;
    }
    setConfig(null);
  };

  if (!config) return null;

  const { message, options } = config;
  const {
    title = '确认操作',
    confirmText = '确认',
    cancelText = '取消',
    type = 'warning',
  } = options;

  const typeConfig = {
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    danger: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  };

  const { icon: Icon, color, bg } = typeConfig[type] || typeConfig.warning;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => handleConfirm(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => handleConfirm(true)}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// 在 App.jsx 中使用
// import ConfirmDialogProvider from './components/ConfirmDialog';
// <ConfirmDialogProvider />

// 使用示例
// const result = await confirm('确定要删除吗？', { title: '删除确认', type: 'danger' });
// if(result) { /* 执行删除 */ }