// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyJWT = (requiredRole = null) => {
  return (req, res, next) => {
    try {
      // Ensure cookies are available (requires cookie-parser middleware in app)
      const cookies = req.cookies || {};
      const patientToken = cookies.patientAuthToken || null;
      const doctorToken = cookies.doctorAuthToken || null;
      const hospitalToken = cookies.hospitalAuthToken || null;

      // Fallback: Authorization header (Bearer <token>)
      const authHeader = req.headers?.authorization || req.headers?.Authorization;
      const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      console.log('verifyJWT: cookies=', cookies);
      console.log(`verifyJWT: patientToken(cookie)=${patientToken} doctorToken(cookie)=${doctorToken} hospitalToken(cookie)=${hospitalToken} bearer=${bearerToken}`);

      // Choose token according to requiredRole or fallback order
      let token = null;
      if (requiredRole === 'patient') token = patientToken || bearerToken;
      else if (requiredRole === 'doctor') token = doctorToken || bearerToken;
      else if (requiredRole === 'hospital') token = hospitalToken || bearerToken;
      else token = patientToken || doctorToken || hospitalToken || bearerToken;

      if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
      }

      // Verify synchronously to simplify flow
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      if (requiredRole && decoded.role !== requiredRole) {
        console.log(`Role mismatch: expected ${requiredRole}, got ${decoded.role}`);
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = decoded;
      console.log('Authenticated:', decoded);
      return next();
    } catch (err) {
      console.error('verifyJWT middleware error:', err);
      return res.status(500).json({ error: 'Server error during token verification' });
    }
  };
};

module.exports = { verifyJWT };
