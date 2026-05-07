// seed.js - 注入演示数据（修复作者名）
const db = require('./config/database');

console.log('📦 开始注入演示数据...');

if (db.getAll('workflows').length === 0) {
  // 添加工作流（带 author_name）
  db.insert('workflows', {
    title: 'SDXL 电影级写实人像',
    description: '基于 SDXL 的高质量人像生成工作流，支持光影、构图微调',
    category: '图像生成',
    tags: 'SDXL,人像,写实',
    price: 0,
    downloads: 1240,
    likes: 356,
    user_id: 1,
    author_name: 'AI_Creator',  // ← 修复作者名
    thumbnail: 'https://picsum.photos/seed/workflow1/400/300'
  });

  db.insert('workflows', {
    title: 'ComfyUI 视频风格化',
    description: '将实拍视频转为动漫/油画风格，支持多种艺术风格',
    category: '视频处理',
    tags: 'ComfyUI,视频,风格化',
    price: 9.9,
    downloads: 890,
    likes: 210,
    user_id: 1,
    author_name: 'AI_Creator',
    thumbnail: 'https://picsum.photos/seed/workflow2/400/300'
  });

  db.insert('workflows', {
    title: 'LoRA 模型训练流水线',
    description: '一键打包训练 LoRA 模型，支持自定义数据集',
    category: '图像生成',
    tags: 'LoRA,训练,AI',
    price: 0,
    downloads: 2100,
    likes: 540,
    user_id: 1,
    author_name: 'AI_Creator',
    thumbnail: 'https://picsum.photos/seed/workflow3/400/300'
  });

  // 添加作品
  db.insert('works', {
    title: '赛博朋克都市夜景',
    description: '使用工作流#1 生成的霓虹夜景',
    media_url: 'https://picsum.photos/seed/cyber/600/400',
    media_type: 'image',
    user_id: 1,
    author_name: 'AI_Creator',
    likes: 42,
    views: 158
  });

  db.insert('works', {
    title: '古风山水动画',
    description: '视频风格化输出示例',
    media_url: 'https://picsum.photos/seed/landscape/600/400',
    media_type: 'image',
    user_id: 1,
    author_name: 'AI_Creator',
    likes: 89,
    views: 320
  });

  // 添加模型
  db.insert('models', {
    name: 'RealVisXL V4.0',
    description: '高质量写实大模型，适合人像和场景生成',
    type: 'Checkpoint',
    version: '4.0',
    downloads: 5600,
    likes: 1200,
    user_id: 1,
    author_name: 'AI_Creator',
    thumbnail: 'https://picsum.photos/seed/model1/300/200'
  });

  db.insert('models', {
    name: 'AnimeLineart_LoRA',
    description: '动漫线稿增强模型',
    type: 'LoRA',
    version: '1.2',
    downloads: 3400,
    likes: 890,
    user_id: 1,
    author_name: 'AI_Creator',
    thumbnail: 'https://picsum.photos/seed/model2/300/200'
  });

  console.log('✅ 演示数据注入成功！刷新页面查看效果');
} else {
  console.log('ℹ️  数据已存在，跳过注入');
}

process.exit(0);