const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.addHook("beforeCreate", async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;