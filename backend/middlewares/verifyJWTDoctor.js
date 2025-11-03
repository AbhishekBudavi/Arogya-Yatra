const jwt = require("jsonwebtoken");

const verifyDoctorJWT = (req, res, next) => {
  try {
    // Try to extract token from cookie first, then from Authorization header
    const token =
      req.cookies?.doctorToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      console.warn("Doctor JWT missing: No token found in header or cookie");
      return res.status(401).json({ error: "Token not provided" });
    }

    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Attach decoded payload to request
      req.doctor = decoded;

      console.log("Authenticated doctor:", decoded);

      next();
    });
  } catch (err) {
    console.error("verifyDoctorJWT middleware error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during token verification" });
  }
};
module.exports = {verifyDoctorJWT}
