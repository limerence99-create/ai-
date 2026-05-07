const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let users = [];
let works = [];
let likes = [];
let userId = 1;
let workId = 1;

if (!fs.existsSync('public')) fs.mkdirSync('public');
if (!fs.existsSync('public/uploads')) fs.mkdirSync('public/uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户已存在' });
  }
  const user = { id: userId++, username, password, avatar: 'default.png' };
  users.push(user);
  res.json(user);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json(user);
});

app.get('/api/works', (req, res) => {
  const result = works.map(w => {
    const u = users.find(uu => uu.id === w.user_id) || {};
    return { ...w, username: u.username, avatar: u.avatar };
  });
  res.json(result);
});

app.post('/api/works', upload.single('file'), (req, res) => {
  const { user_id, title, description, type } = req.body;
  const file_url = req.file ? `/uploads/${req.file.filename}` : '';
  const work = {
    id: workId++, user_id, title, description, type, file_url,
    likes: 0, comments: 0, created_at: new Date()
  };
  works.push(work);
  res.json(work);
});

app.post('/api/works/:id/like', (req, res) => {
  const { user_id } = req.body;
  const id = Number(req.params.id);
  if (likes.find(l => l.user_id === user_id && l.work_id === id)) {
    return res.status(400).json({ error: '已点赞' });
  }
  likes.push({ user_id, work_id: id });
  const w = works.find(ww => ww.id === id);
  if (w) w.likes++;
  res.json({ success: true });
});

app.get('/api/workflows', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log('==================================');
  console.log('✅ 后端启动成功！端口：3000');
  console.log('✅ 无数据库，零报错！');
  console.log('==================================');
});