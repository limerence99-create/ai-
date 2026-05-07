// backend/server.js - Complete Version with Real Download
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/database');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// ========== 中间件 ==========
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/upload', uploadRoutes);

// ========== Auth Routes ==========
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (db.findOne('users', 'username', username) || db.findOne('users', 'email', email)) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = db.insert('users', {
    username,
    email,
    password: hashedPassword,
    created_at: new Date().toISOString()
  });

  const token = jwt.sign({ id: user.id, username, email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    success: true,
    token,
    user: { id: user.id, username, email, created_at: user.created_at }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.findOne('users', 'username', username) || db.findOne('users', 'email', username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findOne('users', 'id', decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ========== Workflow Routes ==========
app.get('/api/workflows', (req, res) => {
  let workflows = db.getAll('workflows');
  const { category, search } = req.query;

  if (category) workflows = workflows.filter(w => w.category === category);
  if (search) {
    const s = search.toLowerCase();
    workflows = workflows.filter(w =>
      w.title?.toLowerCase().includes(s) || w.description?.toLowerCase().includes(s)
    );
  }
  res.json(workflows);
});

app.post('/api/workflows', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const workflow = db.insert('workflows', { ...req.body, user_id: decoded.id, downloads: 0, likes: 0 });
    res.json({ success: true, id: workflow.id });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/workflows/:id/like', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const action = db.toggleLike('workflows', parseInt(req.params.id), decoded.id);
    res.json({ success: true, action });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ========== Work Routes ==========
app.get('/api/works', (req, res) => {
  res.json(db.getAll('works'));
});

app.post('/api/works', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const work = db.insert('works', { ...req.body, user_id: decoded.id, likes: 0, views: 0 });
    res.json({ success: true, id: work.id });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ========== Model Routes ==========
app.get('/api/models', (req, res) => {
  res.json(db.getAll('models'));
});

// 模型下载接口（真实下载）
app.get('/api/models/:id/download', (req, res) => {
  const model = db.findOne('models', 'id', parseInt(req.params.id));
  if (!model) {
    return res.status(404).json({ error: '模型不存在' });
  }

  // 增加下载次数
  model.downloads = (model.downloads || 0) + 1;

  // 如果有真实文件路径
  if (model.file_path) {
    const filePath = path.join(__dirname, model.file_path);
    if (fs.existsSync(filePath)) {
      return res.download(filePath, model.name + '.safetensors');
    }
  }

  // 模拟下载：生成一个虚拟模型文件（用于演示）
  const fileName = `${model.name.replace(/\s+/g, '_')}.safetensors`;
  const fileSize = model.size || Math.floor(Math.random() * 100) + 10; // 10-110 MB

  // 设置响应头，触发浏览器下载
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
  res.setHeader('Content-Length', fileSize * 1024 * 1024); // 转换为字节

  // 生成虚拟数据流（实际应该是真实模型文件）
  const mockData = Buffer.alloc(fileSize * 1024 * 1024, 'AI_MODEL_DATA');

  // 分块发送数据，模拟真实下载进度
  let sent = 0;
  const chunkSize = 1024 * 1024; // 每次发送 1MB

  const sendChunk = () => {
    if (sent >= mockData.length) {
      res.end();
      return;
    }

    const chunk = mockData.slice(sent, sent + chunkSize);
    res.write(chunk);
    sent += chunkSize;

    // 模拟网络延迟
    setTimeout(sendChunk, 10);
  };

  sendChunk();
});

// ========== AI Generation Simulation ==========
const generateJobs = new Map();

app.post('/api/generate/submit', (req, res) => {
  const { prompt, style, user_id } = req.body;
  const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

  generateJobs.set(jobId, {
    id: jobId,
    prompt,
    style: style || 'default',
    user_id: user_id || 1,
    status: 'queued',
    progress: 0,
    result_url: null,
    created_at: new Date().toISOString()
  });

  setTimeout(() => {
    generateJobs.set(jobId, { ...generateJobs.get(jobId), status: 'processing', progress: 10 });
    const interval = setInterval(() => {
      const job = generateJobs.get(jobId);
      if (!job) return clearInterval(interval);

      const newProgress = job.progress + Math.floor(Math.random() * 15) + 5;
      if (newProgress >= 100) {
        clearInterval(interval);
        const resultUrl = `https://picsum.photos/seed/${jobId}/512/512`;
        generateJobs.set(jobId, { ...job, status: 'completed', progress: 100, result_url: resultUrl });

        db.insert('works', {
          title: `AI生成: ${prompt.substring(0, 20)}...`,
          description: `风格: ${job.style} | 提示词: ${prompt}`,
          media_url: resultUrl,
          media_type: 'image',
          user_id: job.user_id,
          likes: 0,
          views: 0
        });
      } else {
        generateJobs.set(jobId, { ...job, progress: newProgress });
      }
    }, 1000);
  }, 500);

  res.json({ success: true, jobId });
});

app.get('/api/generate/status/:jobId', (req, res) => {
  const job = generateJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  res.json(job);
});

// ========== Health Check ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Creation Platform API is running' });
});

// ========== 404 & Error Handler ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ========== Start Server ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});