// filepath: /Users/yuval/Desktop/rcp-project/Rcp-Project/Client/src/components/ReviewItem.tsx
import { Button } from "@/components/ui/button";
import StarsRating from "./StarsRating";
import type { Review } from "@/types/Review";
import { Pencil, Trash2 } from "lucide-react";

export interface ReviewItemProps {
  review: Review;
  canEdit: boolean;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export default function ReviewItem({
  review: r,
  canEdit,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarsRating value={r.rating} />
          <div>
            <p className="text-sm font-medium">
              {r.username || r.userId?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(r)}
              aria-label="Edit review"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(r.id)}
              aria-label="Delete review"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm mt-3 whitespace-pre-wrap">{r.comment}</p>
    </div>
  );
}
