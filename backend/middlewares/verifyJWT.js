// middleware/verifyJWT.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Read JWT from cookies
    const token = req.cookies?.authToken;
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Attach decoded payload to req.user
      req.user = decoded;
      
      next();
    });

  } catch (err) {
    console.error('verifyJWT middleware error:', err);
    return res.status(500).json({ error: 'Internal server error during token verification' });
  }
};
