const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 60000,
        requestTimeout: 60000
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    logging: false,
    retry: {
      max: 3
    }
  }
);

(async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log("SQL Server connected");
      break;
    } catch (err) {
      console.error("DB connection error:", err.message);
      retries--;
      if (retries > 0) {
        console.log(`Retrying connection... (${5 - retries}/5)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error("Failed to connect after retries.");
        process.exit(1);
      }
    }
  }
})();

module.exports = sequelize;