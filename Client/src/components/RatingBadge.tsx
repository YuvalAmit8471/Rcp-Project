import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingBadgeProps {
  averageRating: number | null;
  totalReviews: number;
  className?: string;
}

/**
 * Small average rating badge used on recipe cards.
 * Purely presentational; renders nothing if no reviews.
 */
export default function RatingBadge({
  averageRating,
  totalReviews,
  className,
}: RatingBadgeProps) {
  if (averageRating === null || totalReviews <= 0) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-black/70 text-white px-2 py-0.5 text-xs",
        className
      )}
    >
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <span>{averageRating.toFixed(1)}</span>
      <span className="opacity-75">({totalReviews})</span>
    </div>
  );
}
