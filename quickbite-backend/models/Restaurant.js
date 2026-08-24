const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required']
  },
  rating: Number,
  isOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
