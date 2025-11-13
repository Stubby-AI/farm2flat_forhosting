
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Order } from "../types";

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

export const getDemandForecast = async (orders: Order[]): Promise<Record<string, number>> => {
  if (!API_KEY) {
    // FIX: The return type Record<string, number> requires all values to be numbers.
    return { "API Key not configured": 0 };
  }

  const productCounts = orders
    .flatMap(o => o.items)
    .filter(item => item.type === 'product')
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const productSummary = Object.entries(productCounts)
    .map(([name, quantity]) => `${name}: ${quantity} units`)
    .join(', ');

  const prompt = `Given the following sales data from recent orders: ${productSummary}. 
  Predict the demand for the top 5 products for the next ordering cycle.
  Return the forecast as a simple comma-separated list of key:value pairs. For example: "Organic Carrots:55,Heirloom Tomatoes:40,Spinach:30".
  Do not include any other text, formatting, or explanations.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const text = response.text;
    const forecast: Record<string, number> = {};
    text.split(',').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value && !isNaN(parseInt(value, 10))) {
        forecast[key.trim()] = parseInt(value.trim(), 10);
      }
    });
    return forecast;

  } catch (error) {
    console.error("Error fetching demand forecast from Gemini API:", error);
    // FIX: The return type Record<string, number> requires all values to be numbers.
    return { "Error: Could not retrieve forecast": 0 };
  }
};