import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    req.user = decoded; // Attach user info to request
    next(); // Allow access
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default verifyAdmin;
