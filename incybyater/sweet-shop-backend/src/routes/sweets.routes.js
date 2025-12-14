const express = require('express');
const Sweet = require('../models/Sweet');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

/* Add new sweet */
router.post('/', auth, async (req, res) => {
  const sweet = await Sweet.create(req.body);
  res.json(sweet);
});

/* Get all sweets */
router.get('/', auth, async (req, res) => {
  res.json(await Sweet.find());
});

/* Search sweets */
router.get('/search', auth, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  const query = {};
  if (name) query.name = new RegExp(name, 'i');
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  res.json(await Sweet.find(query));
});

/* Update sweet */
router.put('/:id', auth, async (req, res) => {
  res.json(await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

/* Delete sweet (Admin only) */
router.delete('/:id', auth, admin, async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sweet deleted' });
});

/* Purchase sweet */
router.post('/:id/purchase', auth, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet || sweet.quantity === 0)
    return res.status(400).json({ message: 'Out of stock' });

  sweet.quantity -= 1;
  await sweet.save();
  res.json(sweet);
});

/* Restock sweet (Admin only) */
router.post('/:id/restock', auth, admin, async (req, res) => {
  const { amount } = req.body;
  const sweet = await Sweet.findById(req.params.id);
  sweet.quantity += amount;
  await sweet.save();
  res.json(sweet);
});

module.exports = router;
