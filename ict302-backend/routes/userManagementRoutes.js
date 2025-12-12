// routes/userManagementRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { users, getNextId } = require("../data/users");

// All routes here are admin-only
const adminOnly = [auth, role(["admin"])];

//  GET /api/admin/users  -> list all users
router.get("/", adminOnly, (req, res) => {
  res.json(users);
});

//  GET /api/admin/users/:id  -> get single user by id
router.get("/:id", adminOnly, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

//  POST /api/admin/users  -> create a new user
router.post("/", adminOnly, (req, res) => {
  const { email, password, role: userRole, status } = req.body;

  if (!email || !password || !userRole) {
    return res.status(400).json({
      message: "email, password and role are required"
    });
  }

  // Make sure email is unique
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const newUser = {
    id: getNextId(),
    email,
    password,
    role: userRole,
    status: status || "active"
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

//  PUT /api/admin/users/:id  -> update existing user
router.put("/:id", adminOnly, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { email, password, role: userRole, status } = req.body;

  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password;
  if (userRole !== undefined) user.role = userRole;
  if (status !== undefined) user.status = status;

  res.json({
    message: "User updated successfully",
    user
  });
});

//  DELETE /api/admin/users/:id  -> "deactivate" user
router.delete("/:id", adminOnly, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Soft delete: mark as inactive instead of removing from array
  user.status = "inactive";

  res.json({
    message: "User deactivated successfully",
    user
  });
});

module.exports = router;
