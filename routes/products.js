const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.all('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
router.get('/search', (req, res) => {
  const { brand, color, minPrice, maxPrice } = req.query;
  const filters = [];
  const params = [];

  if (brand) {
    filters.push('brand = ?');
    params.push(brand);
  }
  if (color) {
    filters.push('color = ?');
    params.push(color);
  }
  if (minPrice) {
    filters.push('price >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    filters.push('price <= ?');
    params.push(parseFloat(maxPrice));
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const query = `SELECT * FROM products ${where}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
