// config/database.js - JSON file storage
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data.json');

function initDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [],
      workflows: [],
      works: [],
      models: [],
      likes: [],
      favorites: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    console.log('data.json created');
  }
}

function getAll(collection) {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data[collection] || [];
  } catch (e) {
    console.error('Read data failed:', e);
    return [];
  }
}

function findOne(collection, field, value) {
  const items = getAll(collection);
  return items.find(item => {
    if (field === 'id') return item.id === Number(value);
    return item[field] === value;
  }) || null;
}

function insert(collection, item) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!data[collection]) data[collection] = [];
  item.id = data[collection].length + 1;
  item.created_at = new Date().toISOString();
  data[collection].push(item);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return item;
}

function update(collection, id, updates) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const index = data[collection]?.findIndex(item => item.id === Number(id));
  if (index !== -1) {
    data[collection][index] = { ...data[collection][index], ...updates };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}

function toggleLike(collection, itemId, userId) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const likeIndex = data.likes?.findIndex(
    l => l.user_id === userId && l.target_type === collection && l.target_id === Number(itemId)
  );
  
  if (likeIndex === -1) {
    if (!data.likes) data.likes = [];
    data.likes.push({ user_id: userId, target_type: collection, target_id: Number(itemId) });
    const target = data[collection]?.find(w => w.id === Number(itemId));
    if (target) target.likes = (target.likes || 0) + 1;
  } else {
    data.likes.splice(likeIndex, 1);
    const target = data[collection]?.find(w => w.id === Number(itemId));
    if (target && target.likes > 0) target.likes--;
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return likeIndex === -1 ? 'liked' : 'unliked';
}

initDB();

module.exports = { getAll, findOne, insert, update, toggleLike };
