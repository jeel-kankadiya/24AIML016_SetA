const express = require('express');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    let customer = await Customer.findOne({ email });
    
    if (!customer) {
      customer = new Customer({
        name: name || 'Customer',
        email
      });
      await customer.save();
    }

    const token = jwt.sign(
      { customerId: customer._id, email: customer.email },
      process.env.JWT_SECRET || 'quickbite-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
