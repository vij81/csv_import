const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const validRows = [];
  const failedRows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const { sku, name, brand, color, size, mrp, price, quantity } = row;
      if (!sku || !name || !brand || !mrp || !price) {
        failedRows.push(row);
        return;
      }
      const mrpNum = parseFloat(mrp);
      const priceNum = parseFloat(price);
      const qtyNum = parseInt(quantity || 0);
      if (priceNum > mrpNum || qtyNum < 0) {
        failedRows.push(row);
        return;
      }
      validRows.push({ sku, name, brand, color, size, mrp: mrpNum, price: priceNum, quantity: qtyNum });
    })
    .on('end', () => {
      const insert = db.prepare(`
        INSERT OR REPLACE INTO products (sku, name, brand, color, size, mrp, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      validRows.forEach((p) => {
        insert.run(p.sku, p.name, p.brand, p.color, p.size, p.mrp, p.price, p.quantity);
      });
      insert.finalize();

      fs.unlinkSync(filePath);
      res.json({ stored: validRows.length, failed: failedRows });
    });
});

module.exports = router;
