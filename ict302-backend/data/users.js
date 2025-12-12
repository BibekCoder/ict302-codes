// data/users.js
// In-memory "database" of users for demo purposes

let users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    status: "active"
  },
  {
    id: 2,
    email: "support@example.com",
    password: "support123",
    role: "support",
    status: "active"
  },
  {
    id: 3,
    email: "founder@example.com",
    password: "founder123",
    role: "founder",
    status: "active"
  }
];

// Helper to get next id
function getNextId() {
  if (users.length === 0) return 1;
  const maxId = Math.max(...users.map(u => u.id));
  return maxId + 1;
}

module.exports = {
  users,
  getNextId
};

