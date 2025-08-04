import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  recipe: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
}

const reviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 },
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },
});

reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
