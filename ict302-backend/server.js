const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

// import routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");
const orderRoutes = require("./routes/orderRoutes");


// use routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/admin/users", userManagementRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("ICT302 backend running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
