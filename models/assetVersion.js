const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Asset = require("./asset");
const crypto = require("crypto");

const AssetVersion = sequelize.define("AssetVersion", {
  version: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});


const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


AssetVersion.addHook("beforeCreate", (version) => {
  version.content = encrypt(version.content);
});

AssetVersion.addHook("beforeUpdate", (version) => {
  version.content = encrypt(version.content);
});

AssetVersion.addHook("afterFind", (versions) => {
  if (Array.isArray(versions)) {
    versions.forEach(v => {
      if (v.content) v.content = decrypt(v.content);
    });
  } else if (versions && versions.content) {
    versions.content = decrypt(versions.content);
  }
});

Asset.hasMany(AssetVersion, {
  foreignKey: "assetId",
  as: "versions"
});
AssetVersion.belongsTo(Asset, { foreignKey: "assetId" });

module.exports = AssetVersion;