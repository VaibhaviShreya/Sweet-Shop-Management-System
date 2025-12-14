require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* ✅ MIDDLEWARE — MUST BE BEFORE ROUTES */
app.use(cors());
app.use(express.json()); // ← THIS IS CRITICAL

connectDB();

/* ROUTES */
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sweets', require('./routes/sweets.routes'));

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});
