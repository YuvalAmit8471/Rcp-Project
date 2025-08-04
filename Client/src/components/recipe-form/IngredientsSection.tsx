/**
 * Ingredients section for recipe creation form
 * Handles dynamic list of ingredients with add/remove functionality
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X } from "lucide-react";
import type { RecipeFormData } from "@/hooks/useRecipeForm";

interface IngredientsSectionProps {
  formData: RecipeFormData;
  errors: { [key: string]: string };
  onAddIngredient: () => void;
  onUpdateIngredient: (index: number, value: string) => void;
  onRemoveIngredient: (index: number) => void;
}

export const IngredientsSection = ({
  formData,
  errors,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
}: IngredientsSectionProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Ingredients *</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Ingredient ${index + 1}...`}
              value={ingredient}
              onChange={(e) => onUpdateIngredient(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemoveIngredient(index)}
              disabled={formData.ingredients.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAddIngredient}
          className="w-full"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </Button>
        {errors.ingredients && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-sm">
              {errors.ingredients}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
