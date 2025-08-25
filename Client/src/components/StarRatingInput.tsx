import { Star } from "lucide-react";

export interface StarRatingInputProps {
  value: number;
  hoverValue?: number;
  onSelect: (value: number) => void;
  onHover?: (value: number) => void;
  onLeave?: () => void;
}

/**
 * Interactive 1-5 stars input.
 * Visuals match the existing ReviewForm stars (no behavior changes).
 */
export default function StarRatingInput({
  value,
  hoverValue = 0,
  onSelect,
  onHover,
  onLeave,
}: StarRatingInputProps) {
  const active = hoverValue || value;
  return (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onLeave?.()}
          className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          {...({} as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          <Star
            className={`h-6 w-6 transition-colors duration-200 ${
              star <= active
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
