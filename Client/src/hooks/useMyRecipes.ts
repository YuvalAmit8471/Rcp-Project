/**
 * Custom hook for managing user's personal recipes (saved and created)
 */

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { recipeApi } from "@/services/recipeApi";
import type { Recipe } from "@/types/Recipe";

export const useMyRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Fetch user's saved recipes
   */
  const fetchSavedRecipes = useCallback(async () => {
    if (!user) return;

    try {
      const recipes = await recipeApi.getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (error) {
      console.error("Failed to fetch saved recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load saved recipes.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  /**
   * Fetch user's created recipes
   */
  const fetchCreatedRecipes = useCallback(async () => {
    if (!user) return;

    try {
      const recipes = await recipeApi.getUserCreatedRecipes();
      setCreatedRecipes(recipes);
    } catch (error) {
      console.error("Failed to fetch created recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load your created recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  /**
   * Remove a recipe from saved collection
   */
  const unsaveRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      await recipeApi.unsaveRecipe(recipeId);
      setSavedRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      );
      toast({
        title: "Recipe removed",
        description: "Removed from your saved recipes",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  /**
   * Delete a user's created recipe
   */
  const deleteCreatedRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      await recipeApi.deleteRecipe(recipeId);
      setCreatedRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      );
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
      fetchCreatedRecipes();
    } else {
      setSavedRecipes([]);
      setCreatedRecipes([]);
      setLoading(false);
    }
  }, [user, fetchSavedRecipes, fetchCreatedRecipes]);

  return {
    savedRecipes,
    createdRecipes,
    loading,
    unsaveRecipe,
    deleteCreatedRecipe,
    refetchSaved: fetchSavedRecipes,
    refetchCreated: fetchCreatedRecipes,
  };
};
