
// middleware/verifyJWT.js
const jwt = require('jsonwebtoken');

const verifyPatientJWT = (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
      const token =
      req.cookies?.patientToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      console.warn('JWT missing: No token found in header or cookie');
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Attach decoded payload to request
      req.user = decoded;

      // Optional: log user info for debugging
      console.log('Authenticated user:', decoded);

      next();
    });
  } catch (err) {
    console.error('verifyJWT middleware error:', err);
    return res
      .status(500)
      .json({ error: 'Internal server error during token verification' });
  }
};

module.exports = {verifyPatientJWT}