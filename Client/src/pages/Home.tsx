/**
 * Home Page
 * Main landing page with recipe search, filtering, and display
 * Refactored to use custom hooks and separated components for better maintainability
 */

import { useState } from "react";
import { SearchAndFilterBar } from "@/components/home/SearchAndFilterBar";
import { RecipeGrid } from "@/components/home/RecipeGrid";
import { SurpriseRecipeModal } from "@/components/home/SurpriseRecipeModal";
import { useRecipes } from "@/hooks/useRecipes";
import type { Recipe } from "@/types/Recipe";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import TextType from "../components/TextType";
const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Beverage",
  "Vegetarian",
  "Vegan",
  "Meat",
  "Seafood",
  "Salad",
  "Main",
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [surpriseRecipe, setSurpriseRecipe] = useState<Recipe | null>(null);
  const { user } = useAuth();
  const { recipes, loading, toggleSaveRecipe } = useRecipes();
  const { toast } = useToast();

  /**
   * Filter recipes based on search term and selected category
   */
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Handle surprise me functionality - show random recipe
   */
  const handleSurpriseMe = () => {
    if (recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      setSurpriseRecipe(randomRecipe);
      setSurpriseModalOpen(true);
    }
  };

  /**
   * Handle saving/unsaving recipes
   */
  const handleSaveRecipe = async (id: string) => {
    await toggleSaveRecipe(id);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-10 animate-fade-in pt-4 leading-tight">
            <TextType
              text={[
                "Discover your next favorite recipe.",
                "Cook like a chef, even at home.",
                "Save recipes. Share creations",
                "From idea to plate – instantly.",
                "AI-powered recipes made for you.",
              ]}
              typingSpeed={70}
              pauseDuration={2200}
              showCursor={true}
              cursorCharacter="|"
              className="bg-gradient-hero bg-clip-text text-transparent"
            />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Simple . Fast . Delicious
          </p>
          <Button
            className="bg-gradient-hero bg-clip-text text-transparent animate-float font-bold px-12 py-5 mt-4
              text-xl"
            onClick={() => {
              if (user) {
                window.location.href = "/ai-generator";
              } else {
                toast({
                  title: "Please log in",
                  description:
                    "You need to log in before using the AI generator.",
                });
              }
            }}
          >
            Try our AI
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-10 bg-white/50 backdrop-blur-sm border-y border-border/50">
        <div className="container mx-auto px-4">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSurpriseMe={handleSurpriseMe}
          />
        </div>
      </section>

      {/* Recipes Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {!loading && filteredRecipes.length > 0 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory === "All"
                  ? `Discover ${filteredRecipes.length} Amazing Recipes`
                  : `${filteredRecipes.length} ${selectedCategory} Recipe${
                      filteredRecipes.length > 1 ? "s" : ""
                    }`}
              </h2>
              <p className="text-muted-foreground text-lg">
                {searchTerm
                  ? `Showing results for "${searchTerm}"`
                  : "Handpicked recipes from our community"}
              </p>
            </div>
          )}

          <RecipeGrid
            recipes={filteredRecipes}
            loading={loading}
            onSaveRecipe={handleSaveRecipe}
          />
        </div>
      </section>

      {/* Surprise Recipe Modal */}
      <SurpriseRecipeModal
        recipe={surpriseRecipe}
        isOpen={surpriseModalOpen}
        onClose={() => setSurpriseModalOpen(false)}
        onSaveRecipe={handleSaveRecipe}
      />
    </div>
  );
};

export default Home;
