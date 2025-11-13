
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPersonalizedSuggestions = async (purchaseHistory: Product[]): Promise<string[]> => {
  if (!API_KEY) {
    return Promise.resolve(["API Key not configured. Please set the API_KEY environment variable."]);
  }

  const productNames = purchaseHistory.map(p => p.name).join(', ');

  const prompt = `A user frequently buys the following groceries: ${productNames}. 
  Based on this buying pattern, suggest 5 other fresh produce items they might enjoy.
  Return the suggestions as a simple comma-separated list. For example: "item1, item2, item3, item4, item5".
  Do not include any other text or formatting.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    const text = response.text;
    return text.split(',').map(item => item.trim());

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    return ["We had trouble getting suggestions. Please try again later."];
  }
};
