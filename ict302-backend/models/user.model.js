const bcrypt = require('bcryptjs');

// inside model definition, after define:
User.beforeCreate(async (user) => {
  if (user.password_hash) {
    const hash = await bcrypt.hash(user.password_hash, 10);
    user.password_hash = hash;
  }
});
User.beforeUpdate(async (user) => {
  if (user.changed('password_hash')) {
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
  }
});

// instance method to verify password
User.prototype.verifyPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password_hash);
};
