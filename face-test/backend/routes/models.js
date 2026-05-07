const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取所有模型
router.get('/', (req, res) => {
  const { type, search } = req.query;

  let query = `
    SELECT models.*, users.username as author_name 
    FROM models 
    JOIN users ON models.user_id = users.id 
    WHERE 1=1
  `;
  const params = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }
    res.json(rows);
  });
});

// 获取单个模型
router.get('/:id', (req, res) => {
  db.get(
    `SELECT models.*, users.username as author_name 
     FROM models 
     JOIN users ON models.user_id = users.id 
     WHERE models.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: '模型不存在' });
      }
      res.json(row);
    }
  );
});

// 创建模型
router.post('/', authMiddleware, (req, res) => {
  const { name, description, type, thumbnail, download_url, version } = req.body;

  db.run(
    `INSERT INTO models (name, description, type, thumbnail, download_url, version, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, type, thumbnail, download_url, version, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建失败' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

module.exports = router;