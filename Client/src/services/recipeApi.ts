/**
 * Recipe API Service
 * Centralized API calls for recipe-related operations
 */

import api from "@/lib/api";
import type { Recipe } from "@/types/Recipe";
import { isApiResponse, type ApiResponse } from "./review.guards";

export const recipeApi = {
  /** Fetch all recipes from the database */
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await api.get("/api/recipes");
    const data = response.data;
    if (isApiResponse<Recipe[]>(data)) return data.data;
    return Array.isArray(data) ? (data as Recipe[]) : [];
  },

  /** Fetch user's saved recipes */
  async getSavedRecipes(): Promise<Recipe[]> {
    const response = await api.get("/api/recipes/saved");
    const data = response.data;
    if (isApiResponse<Recipe[]>(data)) return data.data;
    return Array.isArray(data) ? (data as Recipe[]) : [];
  },

  /** Fetch user's created recipes */
  async getUserCreatedRecipes(): Promise<Recipe[]> {
    const response = await api.get("/api/recipes/my");
    const data = response.data;
    if (isApiResponse<Recipe[]>(data)) return data.data;
    return Array.isArray(data) ? (data as Recipe[]) : [];
  },

  /** Save a recipe to user's favorites */
  async saveRecipe(recipeId: string): Promise<void> {
    await api.post(`/api/recipes/${recipeId}/save`);
  },

  /** Remove a recipe from user's favorites */
  async unsaveRecipe(recipeId: string): Promise<void> {
    await api.delete(`/api/recipes/${recipeId}/save`);
  },

  /** Create a new recipe */
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
    const response = await api.post(`/api/recipes`, recipeData);
    const data = response.data;
    if (isApiResponse<Recipe>(data)) return data.data;
    throw new Error("Failed to create recipe");
  },

  /** Delete a recipe */
  async deleteRecipe(recipeId: string): Promise<void> {
    await api.delete(`/api/recipes/${recipeId}`);
  },

  /** Get a specific recipe by ID */
  async getRecipeById(recipeId: string): Promise<Recipe> {
    const response = await api.get(`/api/recipes/${recipeId}`);
    const data = response.data;
    if (isApiResponse<Recipe>(data)) return data.data;
    return data as Recipe;
  },
};
