import { Request, Response } from "express";
import imageModel from "../models/imageModel";
import { analyzeImage, translateResults } from "../services/imageService";

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
          const { translatedCaption, translatedTags } = await translateResults(
            analysisResult.caption,
            analysisResult.tags,
            lang
          );
          const newImageRecord = new imageModel({
            filename,
            language: lang,
            caption: translatedCaption,
            tags: translatedTags,
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
