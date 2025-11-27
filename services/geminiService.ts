import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Product, Order, AISuggestion, Recipe } from "../types";

// VITE ENV VARIABLE
const apiKey = import.meta.env.VITE_API_KEY;

// Check API KEY
if (!apiKey) {
  console.error("❌ VITE_API_KEY not set in .env.local");
}

// Init Gemini Client
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/* ---------------------------------------------------------
   1. Personalized Suggestions
--------------------------------------------------------- */
export const getPersonalizedSuggestions = async (
  purchaseHistory: Product[]
): Promise<AISuggestion[]> => {
  if (!apiKey) {
    return [{ name: "API Key Missing", reason: "Add VITE_API_KEY in .env.local" }];
  }

  const productNames = purchaseHistory.map(p => p.name).join(", ");

  const prompt = `
    A user frequently buys: ${productNames}.
    Suggest 3 new items with short reasons.
    Return JSON ONLY:
    {
      "suggestions": [
        {"name": "...", "reason": "..."}
      ]
    }
  `;

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const json = JSON.parse(text);
    return json.suggestions || [];

  } catch (err) {
    console.error("Gemini Suggestion Error:", err);
    return [{ name: "AI Error", reason: "Failed to generate suggestions." }];
  }
};

/* ---------------------------------------------------------
   2. Demand Forecast
--------------------------------------------------------- */
export const getDemandForecast = async (
  orders: Order[]
): Promise<Record<string, number>> => {
  if (!apiKey) return { "API Key Missing": 0 };

  const productCounts = orders
    .flatMap(order => order.items)
    .filter(item => item.type === "product")
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const summary = Object.entries(productCounts)
    .map(([name, qty]) => `${name}: ${qty}`)
    .join(", ");

  const prompt = `
    Based on sales: ${summary},
    Predict top 5 product demand for next cycle.
    Return strictly like: Carrots:50, Tomatoes:40, ...
  `;

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const forecast: Record<string, number> = {};
    text.split(",").forEach(item => {
      const [key, val] = item.split(":");
      if (key && val && !isNaN(Number(val))) {
        forecast[key.trim()] = Number(val.trim());
      }
    });

    return forecast;

  } catch (err) {
    console.error("Forecast Error:", err);
    return { "Forecast Error": 0 };
  }
};

/* ---------------------------------------------------------
   3. Recipe Generator
--------------------------------------------------------- */
export const generateRecipes = async (
  availableProducts: Product[]
): Promise<Recipe[]> => {
  if (!apiKey) return [];

  const list = availableProducts.map(p => p.name).join(", ");

  const prompt = `
    Available: ${list}.
    Generate 3 recipes.
    Each must include:
      - name
      - description
      - imageUrl (use picsum.photos)
      - ingredients[{name, quantity, isStoreItem}]
      - instructions[]
    Return JSON ONLY:
    { "recipes": [...] }
  `;

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const json = JSON.parse(text);

    return json.recipes.map((recipe: Recipe, index: number) => ({
      ...recipe,
      id: recipe.id || `recipe-${Date.now()}-${index}`
    }));

  } catch (err) {
    console.error("Recipe Error:", err);
    return [];
  }
};
