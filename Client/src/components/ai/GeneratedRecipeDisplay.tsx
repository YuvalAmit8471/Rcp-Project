/**
 * Generated Recipe Display Component
 * Shows the AI-generated recipe with all its details
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Copy, Heart } from "lucide-react";
import { useRecipeActions } from "@/hooks/useRecipeActions";
import type { GeneratedRecipe } from "@/services/aiService";

interface GeneratedRecipeDisplayProps {
  recipe: GeneratedRecipe;
  onSaveRecipe?: () => void;
}

export const GeneratedRecipeDisplay = ({
  recipe,
  onSaveRecipe,
}: GeneratedRecipeDisplayProps) => {
  const { copyRecipeToClipboard, saveGeneratedRecipe } = useRecipeActions();

  /**
   * Handle copy recipe action
   */
  const handleCopyRecipe = () => {
    copyRecipeToClipboard(recipe);
  };

  /**
   * Handle save recipe action
   */
  const handleSaveRecipe = () => {
    if (onSaveRecipe) {
      onSaveRecipe();
    } else {
      saveGeneratedRecipe(recipe);
    }
  };

  return (
    <Card className="shadow-soft animate-scale-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{recipe.title}</CardTitle>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCopyRecipe}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSaveRecipe}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recipe metadata badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.cookTime}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings} servings
          </Badge>
          <Badge variant="outline">{recipe.difficulty}</Badge>
          <Badge variant="outline">{recipe.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ingredients Section */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-sm pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSaveRecipe} className="flex-1">
            <Heart className="h-4 w-4" />
            Save Recipe
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyRecipe}
            className="flex-1"
          >
            <Copy className="h-4 w-4" />
            Copy Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
