const express = require('express');
const Order = require('../models/Order');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

// POST /api/v1/orders (protected)
router.post('/', authGuard, async (req, res, next) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

    if (!restaurantId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID and items are required'
      });
    }

    const order = new Order({
      customerId: req.customerId,
      restaurantId,
      items,
      totalAmount: totalAmount || 0,
      deliveryAddress
    });

    const savedOrder = await order.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders (protected)
router.get('/', authGuard, async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.customerId })
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/orders/:id/status (protected)
router.patch('/:id/status', authGuard, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
