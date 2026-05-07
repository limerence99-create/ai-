const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取所有作品
router.get('/', (req, res) => {
  const { sort = 'created_at' } = req.query;

  db.all(
    `SELECT works.*, users.username as author_name 
     FROM works 
     JOIN users ON works.user_id = users.id 
     ORDER BY ${sort} DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }
      res.json(rows);
    }
  );
});

// 获取单个作品
router.get('/:id', (req, res) => {
  db.run('UPDATE works SET views = views + 1 WHERE id = ?', [req.params.id]);

  db.get(
    `SELECT works.*, users.username as author_name 
     FROM works 
     JOIN users ON works.user_id = users.id 
     WHERE works.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: '作品不存在' });
      }
      res.json(row);
    }
  );
});

// 创建作品
router.post('/', authMiddleware, (req, res) => {
  const { title, description, media_url, media_type, workflow_id } = req.body;

  db.run(
    `INSERT INTO works (title, description, media_url, media_type, workflow_id, user_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, media_url, media_type || 'image', workflow_id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建失败' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 点赞作品
router.post('/:id/like', authMiddleware, (req, res) => {
  const workId = req.params.id;
  const userId = req.user.id;

  db.run(
    'INSERT OR IGNORE INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)',
    [userId, 'work', workId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '操作失败' });
      }

      if (this.changes > 0) {
        db.run('UPDATE works SET likes = likes + 1 WHERE id = ?', [workId]);
        res.json({ success: true, action: 'liked' });
      } else {
        db.run('UPDATE works SET likes = likes - 1 WHERE id = ?', [workId]);
        db.run('DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?',
          [userId, 'work', workId]);
        res.json({ success: true, action: 'unliked' });
      }
    }
  );
});

module.exports = router;