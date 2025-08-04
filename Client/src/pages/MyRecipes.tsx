/**
 * My Recipes Page
 * Displays user's saved and created recipes with tab navigation
 * Refactored to use custom hooks and separated components for better maintainability
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyRecipes } from "@/hooks/useMyRecipes";
import { MyRecipesSearchBar } from "@/components/my-recipes/MyRecipesSearchBar";
import { SavedRecipesTab } from "@/components/my-recipes/SavedRecipesTab";
import { CreatedRecipesTab } from "@/components/my-recipes/CreatedRecipesTab";

const MyRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("saved");
  const { user } = useAuth();

  const {
    savedRecipes,
    createdRecipes,
    loading,
    unsaveRecipe,
    deleteCreatedRecipe,
  } = useMyRecipes();

  /**
   * Filter saved recipes based on search term
   */
  const filteredSavedRecipes = savedRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Filter created recipes based on search term
   */
  const filteredCreatedRecipes = createdRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show login required message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Please log in to view your saved and created recipes.
              </p>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Recipes</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal collection of saved and created recipes
          </p>
        </div>

        {/* Search Bar */}
        <MyRecipesSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your recipes...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="saved">
                  Saved ({savedRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="created">
                  Created ({createdRecipes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="space-y-6">
                <SavedRecipesTab
                  recipes={filteredSavedRecipes}
                  onUnsaveRecipe={unsaveRecipe}
                />
              </TabsContent>

              <TabsContent value="created" className="space-y-6">
                <CreatedRecipesTab
                  recipes={filteredCreatedRecipes}
                  onDeleteRecipe={deleteCreatedRecipe}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
