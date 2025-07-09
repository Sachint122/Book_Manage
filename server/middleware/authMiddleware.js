import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ✅ Use ID to fetch user
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = user; // ✅ Attach user object
      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

export default auth;
