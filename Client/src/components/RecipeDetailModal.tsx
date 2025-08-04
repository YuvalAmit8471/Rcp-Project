// src/components/RecipeDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Recipe } from "@/types/Recipe";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";

type Props = {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
};

const RecipeDetailModal = ({ recipe, isOpen, onClose }: Props) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <img
          src={recipe.image}
          alt={recipe.title}
          className="rounded-xl w-full h-64 object-cover mb-4"
        />
        <p className="text-muted-foreground mb-4">{recipe.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.cookTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            {recipe.category}
          </div>
          <Badge variant="secondary">{recipe.difficulty}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ingredients Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No ingredients listed
              </p>
            )}
          </div>

          {/* Instructions Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground text-sm">
                No instructions provided
              </p>
            )}
          </div>
        </div>

        {/* Tags Section */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
