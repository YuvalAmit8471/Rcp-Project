/**
 * Surprise Recipe Modal Component
 * Shows a random recipe when "Surprise Me" is clicked
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Users, Eye, Heart } from "lucide-react";
import type { Recipe } from "@/types/Recipe";

interface SurpriseRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (id: string) => void;
}

export const SurpriseRecipeModal = ({
  recipe,
  isOpen,
  onClose,
  onSaveRecipe,
}: SurpriseRecipeModalProps) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            🎲 Surprise Recipe: {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Details */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{recipe.description}</p>

            {/* Recipe Stats */}
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
              {recipe.views && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {recipe.views}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => onSaveRecipe(recipe.id)}
                variant={recipe.isSaved ? "secondary" : "default"}
                className="flex-1"
              >
                <Heart
                  className={`h-4 w-4 ${recipe.isSaved ? "fill-current" : ""}`}
                />
                {recipe.isSaved ? "Saved" : "Save Recipe"}
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
