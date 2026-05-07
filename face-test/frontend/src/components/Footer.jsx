import { Heart, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 品牌信息 */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold">创作平台</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              无需配置环境，打开浏览器即可开始创作。海量模型、工作流，助你释放创意。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-bold mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">首页</a></li>
              <li><a href="/workflows" className="hover:text-white transition-colors">工作流市场</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">作品广场</a></li>
              <li><a href="/models" className="hover:text-white transition-colors">模型库</a></li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="font-bold mb-4">联系我们</h4>
            <ul className="space-y-2 text-gray-400">
              <li>邮箱: support@aihub.com</li>
              <li>微信: AI_Creation_Platform</li>
              <li>QQ群: 123456789</li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 AI创作平台. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by AI Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}