// middleware/roleMiddleware.js

// allowedRoles will be an array like ["admin"] or ["support", "admin"]
const roleMiddleware = (allowedRoles) => {
  // We return a new middleware function
  return (req, res, next) => {
    // authMiddleware should have set req.user
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "No role found. Access forbidden." });
    }

    // Check if the user role is one of the allowed ones
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission." });
    }

    // Role is allowed → continue
    next();
  };
};

module.exports = roleMiddleware;
