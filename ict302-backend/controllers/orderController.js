// controllers/orderController.js
const pool = require("../config/db");

// GET /api/orders  -> list all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET /api/orders/:id  -> get one order
exports.getOrderById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// POST /api/orders  -> create new order
exports.createOrder = async (req, res) => {
  const { customerName, customerEmail, items, totalPrice, status } = req.body;

  // basic validation
  if (!customerName || !customerEmail || !items || !totalPrice) {
    return res.status(400).json({
      message:
        "customerName, customerEmail, items and totalPrice are required",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO orders (customer_name, customer_email, items, total_price, status) VALUES (?, ?, ?, ?, ?)",
      [
        customerName,
        customerEmail,
        JSON.stringify(items), // store JSON as text
        totalPrice,
        status || "pending",
      ]
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// PUT /api/orders/:id  -> update order status
exports.updateOrderStatus = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", orderId: id });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Error updating order" });
  }
};
