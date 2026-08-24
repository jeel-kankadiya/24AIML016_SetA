const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// GET /api/v1/restaurants
router.get('/', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      success: true,
      message: 'Restaurants fetched successfully',
      data: restaurants
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
