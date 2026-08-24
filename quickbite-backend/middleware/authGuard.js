const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please login first.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'quickbite-secret-key');
    req.customerId = decoded.customerId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authGuard;
