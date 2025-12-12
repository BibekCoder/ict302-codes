// routes/orderRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const orderController = require("../controllers/orderController");

// support + admin can access orders
const orderAccess = [auth, role(["support", "admin"])];

// GET /api/orders
router.get("/", orderAccess, orderController.getAllOrders);

// GET /api/orders/:id
router.get("/:id", orderAccess, orderController.getOrderById);

// POST /api/orders
router.post("/", orderAccess, orderController.createOrder);

// PUT /api/orders/:id
router.put("/:id", orderAccess, orderController.updateOrderStatus);

module.exports = router;
