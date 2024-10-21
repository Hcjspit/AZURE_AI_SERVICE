import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import imagesRouter from "./routes/imageRouter";

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api", imagesRouter);

export default app;
