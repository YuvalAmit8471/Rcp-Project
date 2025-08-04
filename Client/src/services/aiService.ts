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
    // Call local Ollama server instead of OpenAI
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: `Create a detailed recipe based on this request: "${prompt}".\n\nPlease respond with a JSON object in exactly this format:\n{\n  "title": "Recipe Name",\n  "description": "Brief description of the recipe",\n  "ingredients": ["ingredient 1", "ingredient 2", ...],\n  "instructions": ["step 1", "step 2", ...],\n  "cookTime": "XX min",\n  "servings": number,\n  "difficulty": "Easy/Medium/Hard",\n  "category": "Main/Dessert/Appetizer/etc"\n}\n\nMake sure the response is valid JSON only, no additional text.`,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      // Get detailed error info from Ollama
      const errorText = await ollamaResponse.text();
      throw new Error(
        `Ollama request failed: ${ollamaResponse.status} ${ollamaResponse.statusText} - ${errorText}`
      );
    }

    // Parse Ollama response
    const data = await ollamaResponse.json();
    console.log("Raw Ollama response:", data.response); // Debug log

    let recipe;
    try {
      // Sometimes Ollama wraps JSON in markdown code blocks, so clean it up
      let cleanResponse = data.response.trim();
      if (cleanResponse.startsWith("```json")) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, "")
          .replace(/```\s*$/, "");
      } else if (cleanResponse.startsWith("```")) {
        cleanResponse = cleanResponse
          .replace(/```\s*/, "")
          .replace(/```\s*$/, "");
      }

      recipe = JSON.parse(cleanResponse);
    } catch (e) {
      console.error("Failed to parse Ollama JSON:", data.response); // Debug log
      throw new Error(
        `Failed to parse recipe JSON from Ollama response. Raw response: ${data.response.substring(
          0,
          200
        )}...`
      );
    }
    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Invalid recipe format received from Ollama");
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
