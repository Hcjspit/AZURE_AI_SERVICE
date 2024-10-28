// src/models/imageModel.ts
import { Document, Schema, model } from "mongoose";

// Define the IImage interface for TypeScript
export interface IImage extends Document {
  filename: string;
  language: string;
  caption: string;
  tags: string[];
}

// Define the Mongoose schema based on the IImage interface
const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  language: { type: String, required: true },
  caption: { type: String, required: true },
  tags: { type: [String], required: true },
});

// Export the model for use in other files
const imageModel = model<IImage>("Image", ImageSchema);

export default imageModel;
