/**
 * Create Recipe Page
 * Allows users to create and publish new recipes
 * Refactored into smaller, manageable components for better maintainability
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import { BasicInformationSection } from "@/components/recipe-form/BasicInformationSection";
import { IngredientsSection } from "@/components/recipe-form/IngredientsSection";
import { InstructionsSection } from "@/components/recipe-form/InstructionsSection";
import { AdditionalDetailsSection } from "@/components/recipe-form/AdditionalDetailsSection";

const CreateRecipe = () => {
  const { user } = useAuth();
  const {
    formData,
    currentTag,
    setCurrentTag,
    errors,
    isSaving,
    handleInputChange,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    addTag,
    removeTag,
    handleSubmit,
  } = useRecipeForm();

  // Show login required message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-soft max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Please log in to create and share your recipes.
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
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Create Recipe</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your culinary creation with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information Section */}
          <BasicInformationSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          {/* Ingredients Section */}
          <IngredientsSection
            formData={formData}
            errors={errors}
            onAddIngredient={addIngredient}
            onUpdateIngredient={updateIngredient}
            onRemoveIngredient={removeIngredient}
          />

          {/* Instructions Section */}
          <InstructionsSection
            formData={formData}
            errors={errors}
            onAddInstruction={addInstruction}
            onUpdateInstruction={updateInstruction}
            onRemoveInstruction={removeInstruction}
          />

          {/* Additional Details Section */}
          <AdditionalDetailsSection
            formData={formData}
            currentTag={currentTag}
            onCurrentTagChange={setCurrentTag}
            onInputChange={handleInputChange}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="w-full md:w-auto min-w-[200px]"
              variant="warm"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Recipe...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Create Recipe
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
