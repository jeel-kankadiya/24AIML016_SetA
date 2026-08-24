const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: {
    type: Array,
    required: [true, 'Items array is required']
  },
  totalAmount: {
    type: Number,
    min: [0, 'Total amount must be at least 0']
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
