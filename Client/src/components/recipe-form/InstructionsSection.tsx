/**
 * Instructions section for recipe creation form
 * Handles dynamic list of cooking instructions with add/remove functionality
 */

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X } from "lucide-react";
import type { RecipeFormData } from "@/hooks/useRecipeForm";

interface InstructionsSectionProps {
  formData: RecipeFormData;
  errors: { [key: string]: string };
  onAddInstruction: () => void;
  onUpdateInstruction: (index: number, value: string) => void;
  onRemoveInstruction: (index: number) => void;
}

export const InstructionsSection = ({
  formData,
  errors,
  onAddInstruction,
  onUpdateInstruction,
  onRemoveInstruction,
}: InstructionsSectionProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Instructions *</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium mt-1">
              {index + 1}
            </span>
            <Textarea
              placeholder={`Step ${index + 1}...`}
              value={instruction}
              onChange={(e) => onUpdateInstruction(index, e.target.value)}
              className="flex-1 min-h-[80px]"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemoveInstruction(index)}
              disabled={formData.instructions.length === 1}
              className="mt-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAddInstruction}
          className="w-full"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
        {errors.instructions && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-sm">
              {errors.instructions}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
