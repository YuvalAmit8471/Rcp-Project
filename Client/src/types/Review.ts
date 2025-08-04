export interface Review {
  id: string;
  recipeId: string;
  userId: { _id: string; username: string };
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
}
