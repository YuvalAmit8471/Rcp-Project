/**
 * Recipe Input Component
 * Handles user input for AI recipe generation
 */

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChefHat } from "lucide-react";

interface RecipeInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const RecipeInput = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
}: RecipeInputProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Tell us what you want to cook
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Example: I want a healthy dinner recipe for 4 people using chicken, vegetables, and Mediterranean flavors..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isGenerating}
        />

        <Button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
          variant="warm"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating recipe...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Recipe
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
