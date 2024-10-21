import mongoose, { Schema, Document } from "mongoose";

interface IImage extends Document {
  filename: string;
  language: string;
  caption: string;
  tags: string[];
}

const ImageSchema: Schema = new Schema({
  filename: { type: String, required: true },
  language: { type: String, required: true },
  caption: { type: String },
  tags: { type: [String] },
});

export default mongoose.model<IImage>("Image", ImageSchema);
