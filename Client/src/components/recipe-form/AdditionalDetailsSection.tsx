/**
 * Additional Details section for recipe creation form
 * Handles tags and image URL
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";
import type { RecipeFormData } from "@/hooks/useRecipeForm";

interface AdditionalDetailsSectionProps {
  formData: RecipeFormData;
  currentTag: string;
  onCurrentTagChange: (value: string) => void;
  onInputChange: (field: keyof RecipeFormData, value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const AdditionalDetailsSection = ({
  formData,
  currentTag,
  onCurrentTagChange,
  onInputChange,
  onAddTag,
  onRemoveTag,
}: AdditionalDetailsSectionProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Additional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a tag..."
              value={currentTag}
              onChange={(e) => onCurrentTagChange(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), onAddTag())
              }
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={onAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="image">Recipe Image URL</Label>
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="image"
              placeholder="https://example.com/recipe-image.jpg"
              value={formData.image}
              onChange={(e) => onInputChange("image", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
