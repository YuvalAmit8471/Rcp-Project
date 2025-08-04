import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  savedRecipes: mongoose.Types.ObjectId[];
  savedDemoRecipes?: string[]; // מתכונים דמו שמורים
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    savedDemoRecipes: [{ type: String }], // מערך של IDs של מתכונים דמו
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
