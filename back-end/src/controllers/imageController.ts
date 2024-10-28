import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import imageModel from "../models/imageModel";
import { analyzeImage, translateResults } from "../services/imageService";

export const analyzeImages = async (req: Request, res: Response) => {
  const { languages } = req.body;

  if (
    !languages ||
    !req.files ||
    (req.files as Express.Multer.File[]).length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const files = req.files as Express.Multer.File[];

  const uploadDirectory = path.join(__dirname, "../uploads/");
  console.log(__dirname, uploadDirectory);

  if (!fs.existsSync(uploadDirectory)) {
    try {
      fs.mkdirSync(uploadDirectory, { recursive: true });
      console.log("Creata la cartella uploads");
    } catch (err) {
      console.error("Errore nella creazione della cartella uploads:", err);
      return res
        .status(500)
        .json({ message: "Unable to create upload directory" });
    }
  }

  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error("Errore nella lettura della directory:", err);
    } else {
      console.log("Contenuto della cartella uploads:", files);
    }
  });

  try {
    for (const file of files) {
      const imagePath = path.resolve(uploadDirectory, file.filename);
      console.log("Percorso assoluto del file:", imagePath);

      const imageBuffer = fs.readFileSync(imagePath);
      console.log("File letto in binario con lunghezza:", imageBuffer.length);

      const analysisResult = await analyzeImage(imageBuffer);

      if (analysisResult) {
        for (const lang of languages.split(",")) {
          const { translatedCaption, translatedTags } = await translateResults(
            analysisResult.caption,
            analysisResult.tags,
            lang.trim()
          );

          const newImageRecord = new imageModel({
            filename: file.originalname,
            language: lang.trim(),
            caption: translatedCaption,
            tags: translatedTags,
          });
          await newImageRecord.save();
          console.log(newImageRecord);
          res.json({ newImageRecord });
        }
      }
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.error("Error analyzing images:", error);
    res.status(500).json({ message: "KO", error });
  }
};
