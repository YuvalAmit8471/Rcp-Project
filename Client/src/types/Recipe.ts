export interface Recipe {
  id: string;
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
  savedDate?: string;
  createdDate?: string;
  views?: number;
  likes?: number;
  createdBy: string;
}
