import {
  ComputerVisionClient,
  ComputerVisionClientContext,
} from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.AZURE_KEY as string;
const endpoint = process.env.AZURE_ENDPOINT as string;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

export const analyzeImage = async (imageUrl: string) => {
  try {
    const analysis = await computerVisionClient.analyzeImage(imageUrl, {
      visualFeatures: ["Description"],
    });

    const caption = analysis.description?.captions?.[0]?.text || "";
    const tags = analysis.description?.tags || [];

    return { caption, tags };
  } catch (error) {
    console.error("Azure Error: ", error);
    return null;
  }
};
