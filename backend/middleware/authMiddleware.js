const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await db.collection('users').doc(decoded.id).get();

    if (!userDoc.exists) return res.status(401).json({ message: 'Invalid token' });

    const userData = userDoc.data();
    if (!userData.isActive) return res.status(401).json({ message: 'Account deactivated' });

    req.user = { id: userDoc.id, ...userData };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
