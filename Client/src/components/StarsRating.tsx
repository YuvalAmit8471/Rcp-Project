import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type StarsRatingProps = {
  value: number; // 0-5
  className?: string;
  size?: number; // icon size in px
};

/**
 * Presentational 5-star rating renderer.
 * No logic other than visual fill by value. Safe to reuse across the app.
 */
export default function StarsRating({
  value,
  className,
  size = 16,
}: StarsRatingProps) {
  const intValue = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i <= intValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}
