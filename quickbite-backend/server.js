require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const authGuard = require('./middleware/authGuard');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

const Restaurant = require('./models/Restaurant');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quickbite';

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error handler (must be last)
app.use(errorHandler);

// MongoDB Connection and Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');

    // Seed sample restaurants if collection is empty
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount === 0) {
      const sampleRestaurants = [
        {
          name: 'Pizza Palace',
          cuisine: 'Italian',
          rating: 4.5,
          isOpen: true
        },
        {
          name: 'Burger Bliss',
          cuisine: 'American',
          rating: 4.2,
          isOpen: true
        },
        {
          name: 'Sushi Station',
          cuisine: 'Japanese',
          rating: 4.8,
          isOpen: true
        },
        {
          name: 'Taco Fiesta',
          cuisine: 'Mexican',
          rating: 4.3,
          isOpen: false
        },
        {
          name: 'Curry House',
          cuisine: 'Indian',
          rating: 4.6,
          isOpen: true
        }
      ];

      await Restaurant.insertMany(sampleRestaurants);
      console.log('✅ Sample restaurants seeded');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

connectDB();
