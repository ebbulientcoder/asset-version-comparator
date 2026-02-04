const express = require("express");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/user"); 

const sequelize = require("./config/database");

const Asset = require("./models/asset");
const AssetVersion = require("./models/assetVersion");

const assetRoutes = require("./routes/assets");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/assets", assetRoutes);
app.use("/api/auth", authRoutes);

sequelize.sync({ alter: true, force: false }).then(() => {
  console.log("Tables synced");
  app.listen(8005, () => {
    console.log("Backend running on http://localhost:8005");
  });
  if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: ENCRYPTION_KEY or IV is missing in .env file!");
  console.error("The application cannot start without these keys.");
  process.exit(1); 
}
}).catch(err => {
  console.error("Sync error:", err);
});