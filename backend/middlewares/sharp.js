import sharp from "sharp";
import path from "path";
import fs from "fs";

const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = Date.now() + "-" + req.file.originalname;
    const outputPath = path.join("uploads", filename);

    if(!fs.existsSync("uploads")){
      fs.mkdirSync("uploads")
    }

    await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    req.file.filename = filename;
    next();
  } catch (error) {
    console.error("Error compressing image:", error);
    res.status(500).send("Error processing image");
  }
};

export default compressImage
