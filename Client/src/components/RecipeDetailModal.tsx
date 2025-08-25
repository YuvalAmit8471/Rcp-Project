// src/components/RecipeDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Recipe } from "@/types/Recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reviewApi } from "@/services/reviewApi";
import type { Review } from "@/types/Review";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ReviewForm from "@/components/ReviewForm";
import StarsRating from "@/components/StarsRating";
import ReviewItem from "@/components/ReviewItem";

type Props = {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
};

const RecipeDetailModal = ({ recipe, isOpen, onClose }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);

  const currentUserReview = useMemo(
    () =>
      (user &&
        reviews.find((r) => (r.createdBy || r.userId?._id) === user.id)) ||
      null,
    [user, reviews]
  );

  useEffect(() => {
    const load = async () => {
      if (!recipe || !isOpen) return;
      setLoadingReviews(true);
      try {
        const res = await reviewApi.getRecipeReviews(recipe.id);
        const normalized: Review[] = (res.reviews || []).map((raw: unknown) => {
          const r = raw as Record<string, unknown>;
          const userObj = (r.user as Record<string, unknown>) || {};
          const recipeObj = (r.recipe as Record<string, unknown>) || {};
          const createdBy =
            (typeof r.user === "string"
              ? (r.user as string)
              : (userObj._id as string)) || (r.createdBy as string);

          return {
            id: (r._id as string) || (r.id as string),
            recipeId:
              typeof r.recipe === "string"
                ? (r.recipe as string)
                : (recipeObj._id as string) || recipe.id,
            userId: {
              _id:
                typeof r.user === "string"
                  ? (r.user as string)
                  : (userObj._id as string) || (createdBy as string),
              username:
                (r.userName as string) ||
                (userObj.name as string) ||
                (userObj.email as string) ||
                "User",
            },
            username:
              (r.userName as string) ||
              (userObj.name as string) ||
              (userObj.email as string) ||
              "User",
            rating: (r.rating as number) || 0,
            comment: (r.comment as string) || "",
            createdAt: r.createdAt
              ? new Date(r.createdAt as string)
              : new Date(),
            updatedAt: r.updatedAt
              ? new Date(r.updatedAt as string)
              : undefined,
            createdBy: createdBy || "",
          } as Review;
        });

        setReviews(normalized);
        setAvgRating(res.stats?.averageRating || 0);
        setTotalReviews(res.stats?.totalReviews || normalized.length);
        setShowForm(false);
        setEditingReview(null);
      } catch (e) {
        console.error(e);
        toast({
          title: "Failed to load reviews",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoadingReviews(false);
      }
    };

    load();
  }, [recipe, isOpen, toast]);

  if (!recipe) return null;

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalReviews((prev) => Math.max(0, prev - 1));
      const remaining = reviews.filter((r) => r.id !== reviewId);
      const sum = remaining.reduce((s, r) => s + r.rating, 0);
      setAvgRating(
        remaining.length ? Math.round((sum / remaining.length) * 10) / 10 : 0
      );
      reviewApi.invalidateStats?.(recipe.id);
      toast({ title: "Review deleted" });
    } catch (e) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleReviewSubmitted = (review: Review) => {
    setReviews((prev) => {
      const exists = prev.some((r) => r.id === review.id);
      const next = exists
        ? prev.map((r) => (r.id === review.id ? review : r))
        : [review, ...prev];
      const sum = next.reduce((s, r) => s + r.rating, 0);
      setTotalReviews(next.length);
      setAvgRating(next.length ? Math.round((sum / next.length) * 10) / 10 : 0);
      return next;
    });
    setShowForm(false);
    setEditingReview(null);
    reviewApi.invalidateStats?.(recipe.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent noPadding className="max-w-3xl md:max-w-4xl">
        {/* Sticky header - flush with top, keeps close button reachable */}
        <div className="sticky top-0 z-10 px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <DialogHeader className="flex items-center justify-between !space-y-0">
            <DialogTitle className="text-2xl font-bold truncate pr-8">
              {recipe.title}
            </DialogTitle>
            {/* Default close button lives in DialogContent (top-right) */}
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="rounded-xl w-full h-56 md:h-72 object-cover mb-4"
          />
          <p className="text-muted-foreground mb-4">{recipe.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              {recipe.category}
            </div>
            <Badge variant="secondary">{recipe.difficulty}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No ingredients listed
                </p>
              )}
            </div>

            {/* Instructions Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No instructions provided
                </p>
              )}
            </div>
          </div>

          {/* Tags Section */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <StarsRating value={Math.round(avgRating)} />
                  <span>
                    {avgRating.toFixed(1)} · {totalReviews} review
                    {totalReviews === 1 ? "" : "s"}
                  </span>
                </div>
                {user && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingReview(currentUserReview);
                      setShowForm((s) => !s);
                    }}
                  >
                    {currentUserReview ? "Edit your review" : "Write a review"}
                  </Button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="mb-6">
                <ReviewForm
                  recipeId={recipe.id}
                  recipeName={recipe.title}
                  existingReview={editingReview || undefined}
                  onReviewSubmitted={handleReviewSubmitted}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingReview(null);
                  }}
                />
              </div>
            )}

            {/* Reviews list */}
            <div className="space-y-4">
              {loadingReviews && (
                <p className="text-sm text-muted-foreground">
                  Loading reviews...
                </p>
              )}
              {!loadingReviews && reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to write one!
                </p>
              )}

              {reviews.map((r) => (
                <ReviewItem
                  key={r.id}
                  review={r}
                  canEdit={Boolean(
                    user &&
                      (r.createdBy === user.id || r.userId?._id === user.id)
                  )}
                  onEdit={(rev) => {
                    setEditingReview(rev);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
