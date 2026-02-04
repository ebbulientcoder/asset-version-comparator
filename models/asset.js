const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Asset = sequelize.define("Asset", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
   
  }
});

module.exports = Asset;