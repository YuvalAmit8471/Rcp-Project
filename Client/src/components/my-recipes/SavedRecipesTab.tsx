/**
 * Saved Recipes Tab Content
 * Displays user's saved recipes with search and management functionality
 */

import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@/types/Recipe";

interface SavedRecipesTabProps {
  recipes: Recipe[];
  onUnsaveRecipe: (id: string) => void;
}

export const SavedRecipesTab = ({
  recipes,
  onUnsaveRecipe,
}: SavedRecipesTabProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle recipe view
  const handleViewRecipe = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) {
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">💾</div>
        <h3 className="text-2xl font-bold mb-2">No saved recipes yet</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Start exploring and save your favorite recipes to see them here
        </p>

        <Button variant="outline" className="rounded-xl" asChild>
          <a href="/">Browse Recipes</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="animate-scale-in relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <RecipeCard
              recipe={recipe}
              onSave={() => onUnsaveRecipe(recipe.id)}
              onView={handleViewRecipe}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              onClick={() => onUnsaveRecipe(recipe.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};
