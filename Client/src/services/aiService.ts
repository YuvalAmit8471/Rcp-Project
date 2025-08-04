/**
 * AI Service
 * Handles AI recipe generation API calls
 */

import api from "@/lib/api";

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  difficulty: string;
  category: string;
}

export const aiService = {
  /**
   * Generate a recipe using local Ollama (gemma:4b)
   */
  async generateRecipe(prompt: string): Promise<GeneratedRecipe> {
    // קריאה לשרת שלך במקום ל-Ollama ישירות
    const response = await api.post("/api/ai/generate", { prompt });
    const data = response.data;

    if (!data || !data.result) {
      throw new Error("Invalid response from AI server");
    }

    let recipe;
    try {
      // אם השרת מחזיר טקסט, תפרסר אותו ל-JSON
      recipe = JSON.parse(data.result);
    } catch (e) {
      throw new Error("Failed to parse recipe JSON from server response");
    }

    // בדיקת שדות חובה
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Invalid recipe format received from server");
    }

    return {
      title: recipe.title || "Generated Recipe",
      description: recipe.description || "",
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions)
        ? recipe.instructions
        : [],
      cookTime: recipe.cookTime || "30 min",
      servings: typeof recipe.servings === "number" ? recipe.servings : 4,
      difficulty: recipe.difficulty || "Medium",
      category: recipe.category || "Main",
    };
  },

  /**
   * Get example prompts for user inspiration
   */
  getExamplePrompts(): string[] {
    return [
      "A quick healthy dinner for 2 people using chicken and vegetables",
      "Vegetarian pasta dish with Mediterranean flavors",
      "Easy dessert recipe with chocolate and berries",
      "Comfort food recipe perfect for a rainy day",
      "Spicy Asian-inspired stir fry with tofu",
    ];
  },
};
