import { GoogleGenAI, Type } from "@google/genai";
import { Product, Order, AISuggestion, Recipe } from "../types";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

if (!apiKey) {
  console.warn("NEXT_PUBLIC_API_KEY not set.");
}


// Init AI client
const ai = new GoogleGenAI({ apiKey: apiKey! });

// -------------------- 1. Suggestions --------------------

export const getPersonalizedSuggestions = async (
  purchaseHistory: Product[]
): Promise<AISuggestion[]> => {
  
  if (!apiKey) {
    return [
      { name: "API Key not configured.", reason: "Please set NEXT_PUBLIC_API_KEY." }
    ];
  }

  const productNames = purchaseHistory.map(p => p.name).join(", ");

  const prompt = `
    A user frequently buys: ${productNames}.
    Suggest 3 fresh produce items and give a short reason for each.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text);
    return json.suggestions || [];

  } catch (err) {
    console.error("Gemini Suggestion Error:", err);
    return [{ name: "Error", reason: "AI suggestions failed." }];
  }
};

// -------------------- 2. Demand Forecast --------------------

export const getDemandForecast = async (
  orders: Order[]
): Promise<Record<string, number>> => {

  if (!apiKey) return { "API Key Missing": 0 };

  const productCounts = orders
    .flatMap(o => o.items)
    .filter(i => i.type === "product")
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const productSummary = Object.entries(productCounts)
    .map(([name, qty]) => `${name}: ${qty}`)
    .join(", ");

  const prompt = `
    Using these sales numbers: ${productSummary}.
    Predict top 5 product demand for next cycle.
    Return as "Carrots:50,Tomatoes:40,..." only values.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = response.text;
    const forecast: Record<string, number> = {};

    text.split(",").forEach(p => {
      const [key, val] = p.split(":");
      if (key && !isNaN(Number(val))) {
        forecast[key.trim()] = Number(val.trim());
      }
    });

    return forecast;

  } catch (err) {
    console.error("Forecast Error:", err);
    return { "Forecast Error": 0 };
  }
};

// -------------------- 3. Recipe Generator --------------------

export const generateRecipes = async (
  availableProducts: Product[]
): Promise<Recipe[]> => {

  if (!apiKey) {
    console.error("API Key missing.");
    return [];
  }

  const list = availableProducts.map(p => p.name).join(", ");

  const prompt = `
    Available items: ${list}.
    Generate 3 recipes with:
    - name
    - description
    - ingredients (separate store items & pantry items)
    - step-by-step instructions
    - imageUrl using picsum.photos/id/XXX
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        quantity: { type: Type.STRING },
                        isStoreItem: { type: Type.BOOLEAN }
                      }
                    }
                  },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text);

    return json.recipes.map((recipe: Recipe, index: number) => ({
      ...recipe,
      id: recipe.id || `recipe-${Date.now()}-${index}`,
    }));

  } catch (err) {
    console.error("Recipe Error:", err);
    return [];
  }
};
