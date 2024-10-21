import { Router } from "express";
import { analyzeImages } from "../controllers/imageController";

const router = Router();

router.post("/analyze", analyzeImages);

export default router;
