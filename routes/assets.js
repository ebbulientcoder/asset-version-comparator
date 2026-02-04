const express = require("express");
const multer = require("multer");
const { Op } = require("sequelize");
const { authenticateToken } = require("../middleware/auth"); 
const Asset = require("../models/asset");
const AssetVersion = require("../models/assetVersion");
const path = require("path");

const router = express.Router();  
const upload = multer({ storage: multer.memoryStorage() });

const MAX_VERSIONS = parseInt(process.env.MAX_VERSIONS_PER_ASSET) || 10;
const MAX_DAYS = parseInt(process.env.MAX_DAYS_OLD) || 30;


const ALLOWED_EXTENSIONS = [
  ".txt",
  ".xml",
  ".json",
  ".yml",
  ".yaml",
  ".iml",
  ".config",
];
router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: {
        model: AssetVersion,
        as: "versions",
        order: [["version", "ASC"]]
      }
    });
   
    const formattedAssets = assets.map(asset => {
  
      return(
      {
      _id: asset.id,
      assetName: asset.name,
      versions: asset.versions
    })
    }
  );

    
    res.json(formattedAssets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const transaction = await Asset.sequelize.transaction();  
  try {
    const { assetName } = req.body;
    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ error: "File is required" });
    }

      const ext = path.extname(req.file.originalname).toLowerCase();

    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        await transaction.rollback();
      return res.status(400).json({
        message:
          "Invalid file type. Only txt, xml, json, yml, yaml, iml, .config allowed",
      });
    }
      
    const content = req.file.buffer.toString("utf-8");

   
    let asset = await Asset.findOne({ where: { name: assetName }, transaction });
    if (!asset) {
      asset = await Asset.create({ name: assetName }, { transaction });
    }

    const lastVersion = await AssetVersion.max("version", {
      where: { assetId: asset.id },
      transaction
    });

    const newVersion = await AssetVersion.create({
      assetId: asset.id,
      version: (lastVersion || 0) + 1,
      content  
    }, { transaction });

   
    await cleanupOldVersions(asset.id, transaction);

    await transaction.commit();
    res.json({ success: true });
  } catch (err) {
    await transaction.rollback();
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/compare", async (req, res) => {
  try {
    const { assetName, verA, verB } = req.body;

    const asset = await Asset.findOne({ where: { name: assetName } });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const a = await AssetVersion.findOne({
      where: { assetId: asset.id, version: verA }
    });
    const b = await AssetVersion.findOne({
      where: { assetId: asset.id, version: verB }
    });

    if (!a || !b) {
      return res.status(404).json({ error: "Versions not found" });
    }

    res.json({
      valA: a.content,
      valB: b.content
    });
  } catch (err) {
    console.error("Compare error:", err);
    res.status(500).json({ error: err.message });
  }
});

async function cleanupOldVersions(assetId, transaction) {
  try {
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAYS);

    const deletedByDate = await AssetVersion.destroy({
      where: {
        assetId,
        createdAt: { [Op.lt]: cutoffDate }
      },
      transaction
    });

    
    const allVersions = await AssetVersion.findAll({
      where: { assetId },
      order: [["version", "DESC"]],
      transaction
    });

    if (allVersions.length > MAX_VERSIONS) {
      const versionsToDelete = allVersions.slice(MAX_VERSIONS).map(v => v.id);
      const deletedByCount = await AssetVersion.destroy({
        where: { id: versionsToDelete },
        transaction
      });
      console.log(`Cleaned up ${deletedByCount} old versions by count for asset ${assetId}`);
    }

    if (deletedByDate > 0) {
      console.log(`Cleaned up ${deletedByDate} old versions by date for asset ${assetId}`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
    
  }
}

module.exports = router;