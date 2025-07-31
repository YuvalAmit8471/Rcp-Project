import mongoose, { Document, Schema } from "mongoose";

interface IRecipe extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  bio: string;

  createdAt: Date;
  updatedAt: Date;

  // Custom Methods
  log: () => void;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      require: true,
    },
    bio: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
});

// recipeSchema.pre(/delete/i, async function (this: any, next) {
//   const docId = this.getQuery()._id;
//   await Book.deleteMany({ author: docId });
//   next();
// });

recipeSchema.methods.log = function () {
  console.log(`[INSTANCE LOG] ${this._id}`);
};

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
