/**
 * Recipe Grid Component for Home page
 * Displays filtered recipes in a responsive grid layout
 */

import RecipeCard from "@/components/RecipeCard";
import { Loader2 } from "lucide-react";
import type { Recipe } from "@/types/Recipe";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { useState } from "react";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  onSaveRecipe: (id: string) => void;
}

export const RecipeGrid = ({
  recipes,
  loading,
  onSaveRecipe,
}: RecipeGridProps) => {
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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground mb-4">
          No recipes found matching your criteria.
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter settings.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="transition-all duration-300 hover:scale-[1.07] hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <RecipeCard
              recipe={recipe}
              onSave={() => onSaveRecipe(recipe.id)}
              onView={handleViewRecipe}
            />
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
