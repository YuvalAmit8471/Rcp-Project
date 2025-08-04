/**
 * Recipe API Service
 * Centralized API calls for recipe-related operations
 */

import api from "@/lib/api";
import type { Recipe } from "@/types/Recipe";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const recipeApi = {
  /**
   * Fetch all recipes from the database
   */
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await api.get<ApiResponse<Recipe[]>>("/api/recipes");
    return response.data.success ? response.data.data : [];
  },

  /**
   * Fetch user's saved recipes
   */
  async getSavedRecipes(): Promise<Recipe[]> {
    const response = await api.get<ApiResponse<Recipe[]>>("/api/recipes/saved");
    return response.data.success ? response.data.data : [];
  },

  /**
   * Fetch user's created recipes
   */
  async getUserCreatedRecipes(): Promise<Recipe[]> {
    const response = await api.get<ApiResponse<Recipe[]>>("/api/recipes/my");
    return response.data.success ? response.data.data : [];
  },

  /**
   * Save a recipe to user's favorites
   */
  async saveRecipe(recipeId: string): Promise<void> {
    await api.post(`/api/recipes/${recipeId}/save`);
  },

  /**
   * Remove a recipe from user's favorites
   */
  async unsaveRecipe(recipeId: string): Promise<void> {
    await api.delete(`/api/recipes/${recipeId}/save`);
  },

  /**
   * Create a new recipe
   */
  async createRecipe(recipeData: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    cookTime: string;
    prepTime?: string;
    servings: number;
    ingredients: string[];
    instructions: string[];
    tags: string[];
    image?: string;
  }): Promise<Recipe> {
    const response = await api.post<ApiResponse<Recipe>>(
      "/api/recipes",
      recipeData
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create recipe");
    }
    return response.data.data;
  },

  /**
   * Delete a recipe
   */
  async deleteRecipe(recipeId: string): Promise<void> {
    await api.delete(`/api/recipes/${recipeId}`);
  },

  /**
   * Get a specific recipe by ID
   */
  async getRecipeById(recipeId: string): Promise<Recipe> {
    const response = await api.get<ApiResponse<Recipe>>(
      `/api/recipes/${recipeId}`
    );
    if (!response.data.success) {
      throw new Error("Recipe not found");
    }
    return response.data.data;
  },
};
