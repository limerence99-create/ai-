const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取所有工作流
router.get('/', (req, res) => {
  const { category, search, sort = 'created_at' } = req.query;

  let query = `
    SELECT workflows.*, users.username as author_name 
    FROM workflows 
    JOIN users ON workflows.user_id = users.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  query += ` ORDER BY ${sort} DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }
    res.json(rows);
  });
});

// 获取单个工作流
router.get('/:id', (req, res) => {
  db.get(
    `SELECT workflows.*, users.username as author_name 
     FROM workflows 
     JOIN users ON workflows.user_id = users.id 
     WHERE workflows.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: '工作流不存在' });
      }
      res.json(row);
    }
  );
});

// 创建工作流
router.post('/', authMiddleware, (req, res) => {
  const { title, description, thumbnail, category, tags, workflow_data, price } = req.body;

  db.run(
    `INSERT INTO workflows (title, description, thumbnail, category, tags, workflow_data, price, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, thumbnail, category, tags, JSON.stringify(workflow_data), price || 0, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建失败' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 点赞工作流
router.post('/:id/like', authMiddleware, (req, res) => {
  const workflowId = req.params.id;
  const userId = req.user.id;

  db.run(
    'INSERT OR IGNORE INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)',
    [userId, 'workflow', workflowId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '操作失败' });
      }

      if (this.changes > 0) {
        db.run('UPDATE workflows SET likes = likes + 1 WHERE id = ?', [workflowId]);
        res.json({ success: true, action: 'liked' });
      } else {
        db.run('UPDATE workflows SET likes = likes - 1 WHERE id = ?', [workflowId]);
        db.run('DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?',
          [userId, 'workflow', workflowId]);
        res.json({ success: true, action: 'unliked' });
      }
    }
  );
});

// 下载工作流
router.post('/:id/download', authMiddleware, (req, res) => {
  db.run('UPDATE workflows SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);

  db.get('SELECT * FROM workflows WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: '工作流不存在' });
    }
    res.json({ success: true, workflow: row });
  });
});

module.exports = router;