
const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    async verifyPassword(plainPassword){
      return await bcrypt.compare(plainPassword,this.password_hash);
    }
  }
  User.init(
    {
      id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
      },
      email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{isEmail:true,},
      },
      password_hash:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      role: {
        type: DataTypes.ENUM("admin", "support", "founder"),
        defaultValue: "support",
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
    
  );

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
return User;

};

