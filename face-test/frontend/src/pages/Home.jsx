import { Link } from 'react-router-dom';
import { Workflow, Image, Box, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Workflow,
      title: '工作流市场',
      description: '浏览和使用数千个AI工作流，从图像生成到视频处理',
      color: 'from-blue-500 to-cyan-500',
      link: '/workflows'
    },
    {
      icon: Image,
      title: '作品广场',
      description: '欣赏社区创作的精美AI作品，获取灵感',
      color: 'from-purple-500 to-pink-500',
      link: '/gallery'
    },
    {
      icon: Box,
      title: '模型库',
      description: '海量AI模型，一键调用，无需本地配置',
      color: 'from-orange-500 to-red-500',
      link: '/models'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI创作，从未如此简单
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            无需配置环境，打开浏览器即可开始创作<br />
            海量模型、工作流，助你释放创意
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/workflows"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              开始探索
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              立即加入
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">核心功能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-2xl p-8 shadow-lg card-hover group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-primary-600 font-semibold">
                  了解更多 <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">8000+</div>
              <div className="text-gray-600">AI模型</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">7000+</div>
              <div className="text-gray-600">工作流节点</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10万+</div>
              <div className="text-gray-600">注册用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50万+</div>
              <div className="text-gray-600">AI作品</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">准备好开始创作了吗？</h2>
          <p className="text-xl mb-8 text-primary-100">
            加入我们的创作者社区，与全球AI艺术家一起探索无限可能
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors"
          >
            免费注册
          </Link>
        </div>
      </section>
    </div>
  );
}