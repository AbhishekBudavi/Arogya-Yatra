const jwt = require("jsonwebtoken");

const verifyHospitalJWT = (req, res, next) => {
  try {
    // Try to extract token from cookie first, then from Authorization header
    const token =
      req.cookies?.hospitalAuthToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      console.warn("Hospital JWT missing: No token found in header or cookie");
      return res.status(401).json({ error: "Token not provided" });
    }

    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Verify that the token is for a hospital
      if (decoded.role !== "hospital") {
        return res.status(403).json({ error: "Invalid token role" });
      }

      // Attach decoded payload to request
      req.hospital = decoded;

      console.log("Authenticated hospital:", decoded);

      next();
    });
  } catch (err) {
    console.error("verifyHospitalJWT middleware error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during token verification" });
  }
};

module.exports = { verifyHospitalJWT };
