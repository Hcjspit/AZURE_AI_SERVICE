import { Request, Response } from "express";
import imageModel from "../models/imageModel";
import { analyzeImage } from "../services/imageService";

export const analyzeImages = async (req: Request, res: Response) => {
  const { languages, imageFilenames } = req.body;

  if (!languages || !imageFilenames) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    for (const filename of imageFilenames) {
      const imageUrl = `https://testbobphp2.altervista.org/verifica_azure/${filename}`;
      const analysisResult = await analyzeImage(imageUrl);

      if (analysisResult) {
        for (const lang of languages) {
          const newImageRecord = new imageModel({
            filename,
            language: lang,
            caption: analysisResult.caption,
            tags: analysisResult.tags,
          });
          await newImageRecord.save();
        }
      }
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.error("Error analyzing images:", error);
    res.status(500).json({ message: "KO", error });
  }
};
