import { useState, useEffect } from "react";
import { Recipe } from "@/types/Recipe";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (id: string) => void;
  onView?: (id: string) => void;
}

const RecipeCard = ({ recipe, onSave, onView }: RecipeCardProps) => {
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Update local state when recipe prop changes
  useEffect(() => {
    setIsSaved(recipe.isSaved || false);
  }, [recipe.isSaved]);

  const handleSaveToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    // Call the parent callback - let the parent handle everything
    if (onSave) {
      onSave(recipe.id);
    }
  };
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-white/90"
        >
          {recipe.difficulty}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {recipe.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.cookTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </div>
        </div>

        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(recipe.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={`${
              isSaved ? "text-red-500 border-red-200 hover:bg-red-50" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
