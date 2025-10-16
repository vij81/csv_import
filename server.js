const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use('/upload', uploadRoutes);
app.use('/products', productRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
