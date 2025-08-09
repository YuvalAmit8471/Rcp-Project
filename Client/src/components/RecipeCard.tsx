import { useState, useEffect } from "react";
import { Recipe } from "@/types/Recipe";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { reviewApi } from "@/services/reviewApi";

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

  // Small rating state for the badge
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  // Update local state when recipe prop changes
  useEffect(() => {
    setIsSaved(recipe.isSaved || false);
  }, [recipe.isSaved]);

  // Fetch average rating for the recipe lazily
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stats = await reviewApi.getRecipeReviewStats(recipe.id);
        if (!cancelled) {
          setAvgRating(stats.averageRating);
          setTotalReviews(stats.totalReviews);
        }
      } catch {
        // keep silent; badge just won’t show
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recipe.id]);

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

        {/* Small average rating chip */}
        {avgRating !== null && totalReviews > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 text-white px-2 py-0.5 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{avgRating.toFixed(1)}</span>
            <span className="opacity-75">({totalReviews})</span>
          </div>
        )}
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
