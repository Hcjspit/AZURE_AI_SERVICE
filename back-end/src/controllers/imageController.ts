import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import imageModel from "../models/imageModel"; // Import IImage
import { IImage } from "../models/resultModel";
import { analyzeImage, translateResults } from "../services/imageService";
import "fs";

// Delete files function
async function delete_files(folder_path: string) {
  const files_to_delete = await fs.promises.readdir(folder_path);
  for (const file of files_to_delete) {
    const filePath = path.join(folder_path, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  }
}

// Analyze Images function
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

  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDirectory)) {
    try {
      fs.mkdirSync(uploadDirectory, { recursive: true });
      console.log("Created uploads directory");
    } catch (err) {
      console.error("Error creating uploads directory:", err);
      return res
        .status(500)
        .json({ message: "Unable to create upload directory" });
    }
  }

  try {
    // Define the array with explicit typing
    const processedImages: IImage[] = [];

    for (const file of files) {
      const imagePath = path.resolve(uploadDirectory, file.filename);
      const imageBuffer = fs.readFileSync(imagePath);
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
          processedImages.push(newImageRecord); // Collect each processed image record
        }
      }
    }

    delete_files(uploadDirectory);

    res.json({ message: "OK", processedImages }); // Send response after loop is complete
  } catch (error) {
    console.error("Error analyzing images:", error);
    res.status(500).json({ message: "KO", error });
  }
};

// import { Request, Response } from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import imageModel from "../models/imageModel";
// import { analyzeImage, translateResults } from "../services/imageService";
// import "fs";

// async function delete_files(folder_path: string) {
//   const files_to_delete = await fs.promises.readdir(folder_path);
//   // Iterate over each file
//   for (const file of files_to_delete) {
//     const filePath = path.join(folder_path, file);
//     // Check if it's a file (not a directory)
//     const stats = await fs.promises.stat(filePath);
//     if (stats.isFile()) {
//       // Delete the file
//       await fs.promises.unlink(filePath);
//       console.log(`Deleted file: ${filePath}`);
//     }
//   }
// }

// export const analyzeImages = async (req: Request, res: Response) => {
//   const { languages } = req.body;

//   if (
//     !languages ||
//     !req.files ||
//     (req.files as Express.Multer.File[]).length === 0
//   ) {
//     return res.status(400).json({ message: "Invalid input" });
//   }

//   const files = req.files as Express.Multer.File[];
//   const uploadDirectory = path.join(__dirname, "../uploads/");
//   console.log(__dirname, uploadDirectory);

//   if (!fs.existsSync(uploadDirectory)) {
//     try {
//       fs.mkdirSync(uploadDirectory, { recursive: true });
//       console.log("Creata la cartella uploads");
//     } catch (err) {
//       console.error("Errore nella creazione della cartella uploads:", err);
//       return res
//         .status(500)
//         .json({ message: "Unable to create upload directory" });
//     }
//   }

//   fs.readdir(uploadDirectory, (err, files) => {
//     if (err) {
//       console.error("Errore nella lettura della directory:", err);
//     } else {
//       console.log("Contenuto della cartella uploads:", files);
//     }
//   });

//   try {
//     for (const file of files) {
//       const imagePath = path.resolve(uploadDirectory, file.filename);
//       console.log("Percorso assoluto del file:", imagePath);

//       const imageBuffer = fs.readFileSync(imagePath);
//       console.log("File letto in binario con lunghezza:", imageBuffer.length);

//       const analysisResult = await analyzeImage(imageBuffer);

//       if (analysisResult) {
//         for (const lang of languages.split(",")) {
//           const { translatedCaption, translatedTags } = await translateResults(
//             analysisResult.caption,
//             analysisResult.tags,
//             lang.trim()
//           );

//           const newImageRecord = new imageModel({
//             filename: file.originalname,
//             language: lang.trim(),
//             caption: translatedCaption,
//             tags: translatedTags,
//           });
//           await newImageRecord.save();
//           console.log(newImageRecord);
//           res.json({ newImageRecord });
//         }
//       }
//     }
//     res.json({ message: "OK" });
//   } catch (error) {
//     console.error("Error analyzing images:", error);
//     res.status(500).json({ message: "KO", error });
//   }
// };
