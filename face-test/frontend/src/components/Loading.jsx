export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent absolute top-0"></div>
      </div>
      <span className="ml-4 text-gray-600 font-medium">加载中...</span>
    </div>
  );
}