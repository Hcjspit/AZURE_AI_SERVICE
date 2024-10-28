import "reflect-metadata";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;
const port = process.env.PORT;
const directory = __dirname;

mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.listen(port, () => {
  console.log(
    `Server running on port ${port},\n\Full drectory path: ${directory}`
  );
});
