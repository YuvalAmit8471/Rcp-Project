/**
 * AI Recipe Generator Page
 * Allows users to generate custom recipes using AI based on their preferences
 *
 * Features:
 * - Text-based recipe generation
 * - Example prompts for inspiration
 * - Recipe display with ingredients and instructions
 * - Copy and save functionality
 */

import { Sparkles } from "lucide-react";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import { RecipeInput } from "@/components/ai/RecipeInput";
import { ExamplePrompts } from "@/components/ai/ExamplePrompts";
import { GeneratedRecipeDisplay } from "@/components/ai/GeneratedRecipeDisplay";
import { RecipePlaceholder } from "@/components/ai/RecipePlaceholder";

const AIGenerator = () => {
  // Custom hook to manage AI generation state and operations
  const { prompt, setPrompt, isGenerating, generatedRecipe, generateRecipe } =
    useAIGenerator();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              AI Recipe Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe what you want to cook, and our AI will create a
            personalized recipe just for you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <RecipeInput
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={generateRecipe}
              isGenerating={isGenerating}
            />

            <ExamplePrompts
              onSelectPrompt={setPrompt}
              isGenerating={isGenerating}
            />
          </div>

          {/* Generated Recipe Section */}
          <div className="space-y-6">
            {generatedRecipe ? (
              <GeneratedRecipeDisplay recipe={generatedRecipe} />
            ) : (
              <RecipePlaceholder />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
