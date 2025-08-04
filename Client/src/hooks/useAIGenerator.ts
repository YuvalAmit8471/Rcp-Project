/**
 * Custom hook for AI recipe generation
 * Manages state and operations for generating recipes with AI
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService, type GeneratedRecipe } from "@/services/aiService";

export const useAIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<GeneratedRecipe | null>(null);
  const { toast } = useToast();

  /**
   * Generate a recipe based on user prompt
   * TODO: Replace with real OpenAI API integration. Currently uses placeholder data only.
   */
  const generateRecipe = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a recipe request",
        description: "Describe what kind of recipe you'd like to create.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const recipe = await aiService.generateRecipe(prompt);
      setGeneratedRecipe(recipe);

      toast({
        title: "Recipe generated successfully!",
        description: "Your custom recipe is ready. Enjoy cooking!",
      });
    } catch (error) {
      console.error("Recipe generation failed:", error);
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Clear the current recipe and prompt
   */
  const clearRecipe = () => {
    setGeneratedRecipe(null);
    setPrompt("");
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    generatedRecipe,
    generateRecipe,
    clearRecipe,
  };
};
