// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // This will print all headers so we see exactly what is coming in
  console.log("HEADERS:", req.headers);

  // This safely gets the Authorization header (case-insensitive)
  const authHeader = req.get("Authorization");
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(" ");
  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: "Token missing or bad format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email, iat, exp }
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
