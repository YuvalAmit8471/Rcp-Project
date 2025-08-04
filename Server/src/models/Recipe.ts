import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  ingredients?: string[];
  instructions?: string[];
  tags?: string[];
  isSaved?: boolean;
  savedDate?: Date;
  createdDate?: Date;
  views?: number;
  likes?: number;
  createdBy: mongoose.Types.ObjectId;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cookTime: { type: String, required: true },
    servings: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isSaved: { type: Boolean, default: false },
    savedDate: { type: Date },
    createdDate: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
