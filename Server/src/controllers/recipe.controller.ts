/**
 * Recipe Controller
 *
 * Handles all recipe-related operations including CRUD operations,
 * save/unsave functionality for both demo and real recipes,
 * and user-specific recipe management.
 *
 * Features:
 * - Create, read, update, delete recipes
 * - Save/unsave recipes (supports both demo recipes and database recipes)
 * - Retrieve user's created recipes vs all recipes
 * - Retrieve user's saved recipes (combines demo and real recipes)
 * - Proper authentication and authorization
 * - Data transformation for frontend compatibility
 */

import { Response } from "express";
import mongoose from "mongoose";
import RecipeModel from "../models/Recipe";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

const RecipeController = {
  /**
   * Create a new recipe
   * Requires authentication and validates all required fields
   */
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        image,
        cookTime,
        servings,
        difficulty,
        category,
        ingredients,
        instructions,
        tags,
        isSaved,
        savedDate,
        createdDate,
        views,
        likes,
      } = req.body;

      const userId = req.user?.userId || req.body.createdBy;

      if (!userId) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      // Validate required fields
      if (
        !title ||
        !description ||
        !image ||
        !cookTime ||
        !servings ||
        !difficulty ||
        !category
      ) {
        res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
        return;
      }

      // Create new recipe in database
      const newRecipe = await RecipeModel.create({
        title,
        description,
        image,
        cookTime,
        servings,
        difficulty,
        category,
        ingredients: ingredients || [],
        instructions: instructions || [],
        tags: tags || [],
        isSaved: !!isSaved,
        savedDate,
        createdDate,
        views: views || 0,
        likes: likes || 0,
        createdBy: new mongoose.Types.ObjectId(userId),
      });

      // Transform recipe to match frontend expectations
      const transformedRecipe = {
        id: newRecipe._id?.toString() || newRecipe.id,
        title: newRecipe.title,
        description: newRecipe.description,
        image: newRecipe.image,
        cookTime: newRecipe.cookTime,
        servings: newRecipe.servings,
        difficulty: newRecipe.difficulty,
        category: newRecipe.category,
        ingredients: newRecipe.ingredients || [],
        instructions: newRecipe.instructions || [],
        tags: newRecipe.tags || [],
        isSaved: newRecipe.isSaved,
        savedDate: newRecipe.savedDate?.toISOString(),
        createdDate: newRecipe.createdDate?.toISOString(),
        views: newRecipe.views || 0,
        likes: newRecipe.likes || 0,
        createdBy: newRecipe.createdBy?.toString(),
      };

      res.status(201).json({ success: true, data: transformedRecipe });
    } catch (error) {
      console.error("Create recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe creation", error });
    }
  },

  /**
   * Find a specific recipe by ID
   */
  async findRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await RecipeModel.findById(id);

      if (!recipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      // Transform recipe to match frontend expectations
      const transformedRecipe = {
        id: recipe._id?.toString() || recipe.id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
        isSaved: recipe.isSaved,
        savedDate: recipe.savedDate?.toISOString(),
        createdDate: recipe.createdDate?.toISOString(),
        views: recipe.views || 0,
        likes: recipe.likes || 0,
        createdBy: recipe.createdBy?.toString(),
      };

      res.json({ success: true, data: transformedRecipe });
    } catch (error) {
      console.error("Find recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe fetch", error });
    }
  },

  /**
   * Find all recipes in the database
   * Used by the Home page to display all available recipes
   */
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipes = await RecipeModel.find({});

      // Transform recipes to match frontend expectations
      const transformedRecipes = recipes.map((recipe) => ({
        id: recipe._id?.toString() || recipe.id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
        isSaved: recipe.isSaved,
        savedDate: recipe.savedDate?.toISOString(),
        createdDate: recipe.createdDate?.toISOString(),
        views: recipe.views || 0,
        likes: recipe.likes || 0,
        createdBy: recipe.createdBy?.toString(),
      }));

      res.json({ success: true, data: transformedRecipes });
    } catch (error) {
      console.error("Find all recipes error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipes fetch", error });
    }
  },

  /**
   * Get recipes created by the current user only
   * Used by MyRecipes page to display user's created recipes
   */
  async getUserRecipes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      // Find only recipes created by the current user
      const recipes = await RecipeModel.find({ createdBy: userId });

      // Transform recipes to match frontend expectations
      const transformedRecipes = recipes.map((recipe) => ({
        id: recipe._id?.toString() || recipe.id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
        isSaved: recipe.isSaved,
        savedDate: recipe.savedDate?.toISOString(),
        createdDate: recipe.createdDate?.toISOString(),
        views: recipe.views || 0,
        likes: recipe.likes || 0,
        createdBy: recipe.createdBy?.toString(),
      }));

      res.json({ success: true, data: transformedRecipes });
    } catch (error) {
      console.error("Get user recipes error:", error);
      res
        .status(500)
        .json({ message: "Server error during user recipes fetch", error });
    }
  },
  async updateRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await RecipeModel.findById(id);
      if (!recipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }
      // Only allow creator to update
      const userId = req.user?.userId || req.body.createdBy;
      if (!userId || recipe.createdBy.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to edit this recipe",
        });
        return;
      }
      const updateFields = [
        "title",
        "description",
        "image",
        "cookTime",
        "servings",
        "difficulty",
        "category",
        "ingredients",
        "instructions",
        "tags",
        "isSaved",
        "savedDate",
        "createdDate",
        "views",
        "likes",
      ];
      const updateData: any = {};
      for (const field of updateFields) {
        if (field in req.body) updateData[field] = req.body[field];
      }
      const updatedRecipe = await RecipeModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );
      res.json({ success: true, data: updatedRecipe });
    } catch (error) {
      console.error("Update recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe update", error });
    }
  },
  async deleteRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await RecipeModel.findById(id);
      if (!recipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }
      // Only allow creator to delete
      const userId = req.user?.userId || req.body.createdBy;
      if (!userId || recipe.createdBy.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to delete this recipe",
        });
        return;
      }
      await RecipeModel.findByIdAndDelete(id);
      res.json({ success: true, message: `Recipe with id: ${id} Deleted` });
    } catch (error) {
      console.error("Delete recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe deletion", error });
    }
  },
  async saveRecipe(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const recipeId = req.params.id;

    try {
      if (!userId) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // בדיקה אם זה מתכון דמו (מתחיל ב-demo-)
      if (recipeId.startsWith("demo-")) {
        // עבור מתכונים דמו, פשוט נוסיף את ה-ID כמחרוזת למערך savedDemoRecipes
        if (!user.savedDemoRecipes) {
          user.savedDemoRecipes = [];
        }

        if (user.savedDemoRecipes.includes(recipeId)) {
          res
            .status(400)
            .json({ success: false, message: "Recipe already saved" });
          return;
        }

        user.savedDemoRecipes.push(recipeId);
        await user.save();
        res.json({ success: true, message: "Demo recipe saved successfully" });
        return;
      }

      // עבור מתכונים רגילים, נבדוק שהם קיימים במסד הנתונים
      const recipe = await RecipeModel.findById(recipeId);
      if (!recipe) {
        res.status(404).json({ success: false, message: "Recipe not found" });
        return;
      }

      const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
      if (user.savedRecipes.includes(recipeObjectId)) {
        res
          .status(400)
          .json({ success: false, message: "Recipe already saved" });
        return;
      }

      user.savedRecipes.push(recipeObjectId);
      await user.save();
      res.json({ success: true, message: "Recipe saved successfully" });
    } catch (error) {
      console.error("Save recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe save", error });
    }
  },
  async getSavedRecipes(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    try {
      if (!userId) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      const user = await User.findById(userId).populate("savedRecipes");
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // Filter out any null/undefined recipes that might have been deleted
      const validRecipes = user.savedRecipes.filter(
        (recipe: any) => recipe != null
      );

      // מתכונים רגילים מהמסד
      const transformedRecipes = validRecipes.map((recipe: any) => ({
        id: recipe._id?.toString() || recipe.id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
        isSaved: true, // Always true for saved recipes
        savedDate: recipe.savedDate?.toISOString(),
        createdDate:
          recipe.createdDate?.toISOString() || recipe.createdAt?.toISOString(),
        views: recipe.views || 0,
        likes: recipe.likes || 0,
        createdBy: recipe.createdBy?.toString() || null,
      }));

      // מתכונים דמו שמורים
      const savedDemoRecipes = user.savedDemoRecipes || [];
      const demoRecipesData = [
        {
          id: "demo-1",
          title: "Apple Pie",
          description: "Classic apple pie with cinnamon and a flaky crust.",
          image:
            "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80",
          cookTime: "1h",
          servings: 8,
          difficulty: "Medium",
          category: "Dessert",
          views: 45,
          likes: 12,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-2",
          title: "BBQ Pulled Pork",
          description: "Slow-cooked pork shoulder with tangy BBQ sauce.",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
          cookTime: "6h",
          servings: 6,
          difficulty: "Hard",
          category: "Main",
          views: 78,
          likes: 23,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-3",
          title: "Caprese Salad",
          description:
            "Fresh mozzarella, ripe tomatoes, and basil drizzled with balsamic glaze.",
          image:
            "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80",
          cookTime: "10m",
          servings: 2,
          difficulty: "Easy",
          category: "Salad",
          views: 32,
          likes: 8,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-4",
          title: "Chocolate Lava Cake",
          description:
            "Rich chocolate cake with a molten center that flows like lava when cut.",
          image:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
          cookTime: "30m",
          servings: 4,
          difficulty: "Medium",
          category: "Dessert",
          views: 89,
          likes: 34,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-5",
          title: "Grilled Salmon",
          description:
            "Fresh salmon fillet grilled to perfection with herbs and lemon.",
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
          cookTime: "20m",
          servings: 2,
          difficulty: "Easy",
          category: "Main",
          views: 56,
          likes: 19,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-6",
          title: "Mushroom Risotto",
          description:
            "Creamy Arborio rice cooked with wild mushrooms and parmesan cheese.",
          image:
            "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
          cookTime: "45m",
          servings: 4,
          difficulty: "Medium",
          category: "Main",
          views: 67,
          likes: 15,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-7",
          title: "Pasta Carbonara",
          description:
            "Classic Italian pasta with crispy pancetta, eggs, and parmesan cheese.",
          image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80",
          cookTime: "25m",
          servings: 2,
          difficulty: "Easy",
          category: "Main",
          views: 92,
          likes: 28,
          createdBy: "demo",
          isSaved: true,
        },
        {
          id: "demo-8",
          title: "Thai Green Curry",
          description:
            "Spicy and aromatic green curry with chicken, vegetables, and coconut milk.",
          image:
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
          cookTime: "40m",
          servings: 4,
          difficulty: "Medium",
          category: "Main",
          views: 73,
          likes: 21,
          createdBy: "demo",
          isSaved: true,
        },
      ];

      // סינון מתכונים דמו שמורים
      const savedDemoRecipesData = demoRecipesData.filter((demo) =>
        savedDemoRecipes.includes(demo.id)
      );

      // איחוד המתכונים
      const allSavedRecipes = [...transformedRecipes, ...savedDemoRecipesData];

      res.json({
        success: true,
        data: allSavedRecipes,
      });
    } catch (error) {
      console.error("Get saved recipes error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
  async unsaveRecipe(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const recipeId = req.params.id;

    try {
      if (!userId) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // בדיקה אם זה מתכון דמו
      if (recipeId.startsWith("demo-")) {
        if (
          !user.savedDemoRecipes ||
          !user.savedDemoRecipes.includes(recipeId)
        ) {
          res
            .status(400)
            .json({ success: false, message: "Demo recipe not saved" });
          return;
        }

        user.savedDemoRecipes = user.savedDemoRecipes.filter(
          (id) => id !== recipeId
        );
        await user.save();
        res.json({
          success: true,
          message: "Demo recipe unsaved successfully",
        });
        return;
      }

      // עבור מתכונים רגילים
      const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
      if (!user.savedRecipes.includes(recipeObjectId)) {
        res.status(400).json({ success: false, message: "Recipe not saved" });
        return;
      }

      user.savedRecipes = user.savedRecipes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(recipeObjectId)
      );
      await user.save();
      res.json({ success: true, message: "Recipe unsaved successfully" });
    } catch (error) {
      console.error("Unsave recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe unsave", error });
    }
  },
};

export default RecipeController;
