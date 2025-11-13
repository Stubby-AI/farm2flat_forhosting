
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Order, AISuggestion, Recipe } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPersonalizedSuggestions = async (purchaseHistory: Product[]): Promise<AISuggestion[]> => {
  if (!API_KEY) {
    return Promise.resolve([{ name: "API Key not configured.", reason: "Please set the API_KEY environment variable." }]);
  }

  const productNames = purchaseHistory.map(p => p.name).join(', ');

  const prompt = `A user frequently buys the following groceries: ${productNames}. 
  Based on this buying pattern, suggest 3 other fresh produce items they might enjoy. For each item, provide a very short reason why they might like it.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
                                name: { type: Type.STRING, description: "Name of the suggested product." },
                                reason: { type: Type.STRING, description: "A short reason for the suggestion." }
                            }
                        }
                    }
                }
            }
        }
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.suggestions || [];

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    return [{ name: "Error", reason: "We had trouble getting suggestions. Please try again later." }];
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

export const generateRecipes = async (availableProducts: Product[]): Promise<Recipe[]> => {
    if (!API_KEY) {
        console.error("API Key not configured.");
        return [];
    }
    
    const productList = availableProducts.map(p => p.name).join(', ');

    const prompt = `Based on the following available fresh produce items: ${productList}, generate 3 unique and appealing recipe ideas. 
    For each recipe, provide a name, a short description, a detailed list of ingredients, and step-by-step instructions. 
    For the ingredients, clearly distinguish between items available from the store list and common pantry staples (like oil, salt, pepper, flour).
    For the imageUrl, provide a URL from picsum.photos with a unique ID for each image that would thematically fit the recipe. Use the format https://picsum.photos/id/XXX/600/400 where XXX is a number between 200 and 400.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
                                    instructions: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.recipes.map((recipe: Recipe, index: number) => ({
            ...recipe,
            id: recipe.id || `recipe-${Date.now()}-${index}`
        }));

    } catch (error) {
        console.error("Error generating recipes from Gemini API:", error);
        return [];
    }
};
