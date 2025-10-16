const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./products.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      sku TEXT PRIMARY KEY,
      name TEXT,
      brand TEXT,
      color TEXT,
      size TEXT,
      mrp REAL,
      price REAL,
      quantity INTEGER
    )
  `);
});

module.exports = db;
