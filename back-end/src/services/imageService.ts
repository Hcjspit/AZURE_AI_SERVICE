import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const key = process.env.AZURE_KEY_IMG as string;
const endpoint = process.env.AZURE_ENDPOINT_IMAGE as string;

const key2 = process.env.AZURE_KEY_TRN as string;
const endpoint2 = process.env.AZURE_ENDPOINT_TRANSLATOR as string;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

export const analyzeImage = async (imageBuffer: Buffer) => {
  try {
    const analysis = await computerVisionClient.analyzeImageInStream(
      imageBuffer,
      {
        visualFeatures: ["Description"],
      }
    );

    const caption = analysis.description?.captions?.[0]?.text || "";
    const tags = analysis.description?.tags || [];

    return { caption, tags };
  } catch (error) {
    console.error("Azure Error: ", error);
    return null;
  }
};

// Funzione per tradurre un testo utilizzando Azure Translator
const translateText = async (text: string, targetLanguage: string) => {
  const url = `${endpoint2}/translate?api-version=3.0&to=${targetLanguage}`;

  const response = await axios.post(url, [{ text }], {
    headers: {
      "Ocp-Apim-Subscription-Key": key2,
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Region": "switzerlandnorth",
    },
  });

  return response.data[0].translations[0].text;
};

export const translateResults = async (
  caption: string,
  tags: string[],
  language: string
) => {
  const translatedCaption = await translateText(caption, language);
  const translatedTags = await Promise.all(
    tags.map((tag) => translateText(tag, language))
  );

  return { translatedCaption, translatedTags };
};
