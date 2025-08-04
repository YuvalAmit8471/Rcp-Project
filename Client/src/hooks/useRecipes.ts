/**
 * Custom hook for managing recipe operations
 * Provides recipe data fetching, saving, and state management
 */

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { recipeApi } from "@/services/recipeApi";
import type { Recipe } from "@/types/Recipe";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Fetch all recipes and user's saved recipes
   */
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all recipes
      const allRecipes = await recipeApi.getAllRecipes();

      // Fetch user's saved recipes if logged in
      let savedIds = new Set<string>();
      if (user) {
        try {
          const savedRecipes = await recipeApi.getSavedRecipes();
          savedIds = new Set(savedRecipes.map((recipe) => recipe.id));
        } catch (error) {
          console.error("Failed to fetch saved recipes:", error);
          // Don't show error toast for saved recipes as it's not critical
        }
      }

      // Mark recipes as saved based on user's saved list
      const recipesWithSavedStatus = allRecipes.map((recipe) => ({
        ...recipe,
        isSaved: savedIds.has(recipe.id),
      }));

      setRecipes(recipesWithSavedStatus);
      setSavedRecipeIds(savedIds);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  /**
   * Toggle save/unsave status for a recipe
   */
  const toggleSaveRecipe = async (recipeId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    // Update local state optimistically
    const isCurrentlySaved = savedRecipeIds.has(recipeId);
    const newSavedIds = new Set(savedRecipeIds);

    if (isCurrentlySaved) {
      newSavedIds.delete(recipeId);
    } else {
      newSavedIds.add(recipeId);
    }

    setSavedRecipeIds(newSavedIds);

    // Update recipes state to reflect the change
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isSaved: !isCurrentlySaved }
          : recipe
      )
    );

    try {
      if (isCurrentlySaved) {
        await recipeApi.unsaveRecipe(recipeId);
        toast({
          title: "Recipe removed",
          description: "Removed from your saved recipes",
        });
      } else {
        await recipeApi.saveRecipe(recipeId);
        toast({
          title: "Recipe saved!",
          description: "Added to your saved recipes",
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setSavedRecipeIds(savedRecipeIds);
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, isSaved: isCurrentlySaved }
            : recipe
        )
      );

      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Initial fetch on mount and when user changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    savedRecipeIds,
    loading,
    toggleSaveRecipe,
    refetchRecipes: fetchRecipes,
  };
};
