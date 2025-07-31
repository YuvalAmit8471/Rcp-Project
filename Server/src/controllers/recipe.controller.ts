import { Request, Response } from "express";
import RecipeModel from "../models/Recipe";

const RecipeController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, bio } = req.body;

      if (!name || !bio) {
        res.status(400).json({
          success: false,
          message: "name or bio are missing",
        });
        return;
      }

      const newRecipe = await RecipeModel.create({
        name,
        bio,
      });

      await newRecipe.save();

      res.status(201).json({
        success: true,
        data: newRecipe,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error during registration", error });
    }
  },

  async findRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const recipe = await RecipeModel.findById(id).populate("books");

      if (!recipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      recipe.log();

      res.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error during registration", error });
    }
  },
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await RecipeModel.find({});

      if (!recipes.length) {
        res.status(404).json({
          success: false,
          message: `No Recipes found, add some`,
        });
        return;
      }

      res.json({
        success: true,
        data: recipes,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error during registration", error });
    }
  },
  async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, bio } = req.body;

      if (!name && !bio) {
        res.status(400).json({
          success: false,
          message: `At least one field is required`,
        });
        return;
      }

      const updatedRecipe = await RecipeModel.findByIdAndUpdate(
        id,
        {
          name,
          bio,
        },
        { new: true }
      );

      if (!updatedRecipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      res.json({
        success: true,
        data: updatedRecipe,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error during registration", error });
    }
  },
  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      await RecipeModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: `Recipe with id: ${id} Deleted, R.I.P`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error during registration", error });
    }
  },
};

export default RecipeController;
