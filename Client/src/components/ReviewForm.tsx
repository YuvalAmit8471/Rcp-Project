/**
 * Create Review Page
 * Allows users to create and publish new reviews for a specific recipe
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { reviewApi } from "@/services/reviewApi";
import type { Review } from "@/types/Review";

interface ReviewFormProps {
  recipeId: string;
  recipeName?: string;
  onReviewSubmitted?: (review: Review) => void;
  onCancel?: () => void;
  existingReview?: Review | null; // For editing existing reviews
}

export const ReviewForm = ({
  recipeId,
  recipeName,
  onReviewSubmitted,
  onCancel,
  existingReview,
}: ReviewFormProps) => {
  // Form state
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();

  // Validation
  const isFormValid = rating > 0 && comment.trim().length > 0;
  const isEditing = !!existingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid) {
      toast({
        title: "Incomplete Review",
        description: "Please provide both a rating and comment",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please write at least 10 characters for your review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let review: Review;

      if (isEditing && existingReview) {
        // Update existing review
        review = await reviewApi.updateReview(existingReview.id, {
          rating,
          comment: comment.trim(),
        });

        toast({
          title: "Review Updated!",
          description: "Your review has been updated successfully",
        });
      } else {
        // Create new review
        review = await reviewApi.createReview(recipeId, {
          userId: user.id,
          username: user.email,
          rating,
          comment: comment.trim(),
        });

        toast({
          title: "Review Submitted!",
          description: "Thank you for sharing your feedback",
        });
      }

      // Reset form if creating new review
      if (!isEditing) {
        setRating(0);
        setComment("");
      }

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(review);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      // Reset to original values
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || "");
    } else {
      // Clear form
      setRating(0);
      setComment("");
    }

    if (onCancel) {
      onCancel();
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 transition-colors duration-200 ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Select a rating";
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to write a review for this recipe
            </p>
            <Button asChild>
              <a href="/login">Login to Review</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⭐ {isEditing ? "Edit Your Review" : "Write a Review"}
          {recipeName && (
            <span className="text-base font-normal text-muted-foreground">
              for "{recipeName}"
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Rating <span className="text-red-500">*</span>
            </label>
            {renderStars()}
            <p className="text-sm text-muted-foreground">
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium leading-none"
            >
              Your Review <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this recipe. What did you like? Any tips for other cooks?"
              rows={4}
              className="resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span>{comment.length}/500</span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Review Guidelines:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on the recipe, cooking process, and results</li>
              <li>• Share helpful tips or modifications you made</li>
              <li>• Be respectful to the recipe creator and other users</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>{isEditing ? "Update Review" : "Submit Review"}</>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
