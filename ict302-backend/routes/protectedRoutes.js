// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

//  Support staff + admin can access all orders
router.get("/orders", auth, role(["support", "admin"]), (req, res) => {
  res.json({
    message: "Here are all NDIS/TAC orders (demo data).",
    accessedBy: req.user
  });
});

//  Founder only: system settings
router.get("/founder/settings", auth, role(["founder"]), (req, res) => {
  res.json({
    message: "Founder-level system settings area (demo).",
    accessedBy: req.user
  });
});

module.exports = router;
