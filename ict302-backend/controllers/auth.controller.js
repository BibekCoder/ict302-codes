const generateToken = require("../utils/generateToken");
const { User } = require("../models/user.model"); // adjust export based on your setup

// ----------------------
// REGISTER CONTROLLER
// ----------------------
exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user (hooks will hash password automatically)
    const user = await User.create({
      email,
      password_hash: password,
      name,
      role: role || "support",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ----------------------
// LOGIN CONTROLLER
// ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValid = await user.verifyPassword(password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Return login success
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
