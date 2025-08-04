/**
 * Basic Information section for recipe creation form
 * Handles title, description, category, difficulty, times, and servings
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Users } from "lucide-react";
import type { RecipeFormData } from "@/hooks/useRecipeForm";

interface BasicInformationSectionProps {
  formData: RecipeFormData;
  errors: { [key: string]: string };
  onInputChange: (field: keyof RecipeFormData, value: string) => void;
}

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Beverage",
];

const difficulties = ["Easy", "Medium", "Hard"];

export const BasicInformationSection = ({
  formData,
  errors,
  onInputChange,
}: BasicInformationSectionProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Recipe Title *</Label>
            <Input
              id="title"
              placeholder="Enter recipe title..."
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.title}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your recipe..."
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              className={`min-h-[100px] ${
                errors.description ? "border-destructive" : ""
              }`}
            />
            {errors.description && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.description}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => onInputChange("category", value)}
            >
              <SelectTrigger
                className={errors.category ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.category}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label>Difficulty *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => onInputChange("difficulty", value)}
            >
              <SelectTrigger
                className={errors.difficulty ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.difficulty && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.difficulty}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="prepTime">Prep Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="prepTime"
                placeholder="e.g. 15 min"
                value={formData.prepTime}
                onChange={(e) => onInputChange("prepTime", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cookTime">Cook Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="cookTime"
                placeholder="e.g. 30 min"
                value={formData.cookTime}
                onChange={(e) => onInputChange("cookTime", e.target.value)}
                className={`pl-10 ${
                  errors.cookTime ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.cookTime && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.cookTime}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="servings">Servings *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="servings"
                placeholder="e.g. 4"
                value={formData.servings}
                onChange={(e) => onInputChange("servings", e.target.value)}
                className={`pl-10 ${
                  errors.servings ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.servings && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">
                  {errors.servings}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
