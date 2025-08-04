/**
 * Custom hook for recipe utility actions (copy, save, etc.)
 * Provides common recipe operations that can be used across components
 */

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { GeneratedRecipe } from "@/services/aiService";
import { recipeApi } from "@/services/recipeApi";
export const useRecipeActions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Copy recipe text to clipboard
   */
  const copyRecipeToClipboard = (recipe: GeneratedRecipe) => {
    const recipeText = `
${recipe.title}

${recipe.description}

Ingredients:
${recipe.ingredients.map((ingredient) => `• ${ingredient}`).join("\n")}

Instructions:
${recipe.instructions
  .map((instruction, index) => `${index + 1}. ${instruction}`)
  .join("\n")}

Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}
Difficulty: ${recipe.difficulty}
Category: ${recipe.category}
    `.trim();

    navigator.clipboard.writeText(recipeText);
    toast({
      title: "Recipe copied!",
      description: "The recipe has been copied to your clipboard.",
    });
  };

  /**
   * Save recipe to DB for logged-in user
   */
  const saveGeneratedRecipe = async (recipe: GeneratedRecipe) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }
    try {
      await recipeApi.createRecipe({
        ...recipe,
        tags: [],
        image:
          "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg", // הוסף תמונת ברירת מחדל
      });
      toast({
        title: "Recipe saved!",
        description: "The AI-generated recipe was saved to your recipes.",
      });
      // Redirect to My Recipes page after saving

      navigate("/my-recipes");
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save the recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    copyRecipeToClipboard,
    saveGeneratedRecipe,
  };
};
