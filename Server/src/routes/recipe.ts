import express from "express";
import RecipeController from "../controllers/recipe.controller";
import { authenticateToken } from "../middleware/auth";
// import { validateRegisterInput, validateLoginInput } from '../middleware/validation';

const router = express.Router();

// Authentication routes
router.post("/", authenticateToken, RecipeController.create);
router.get("/", RecipeController.findAll);
router.get("/my", authenticateToken, RecipeController.getUserRecipes);
router.get("/saved", authenticateToken, RecipeController.getSavedRecipes);
router.get("/:id", RecipeController.findRecipe);
router.put("/:id", authenticateToken, RecipeController.updateRecipe);
router.delete("/:id", authenticateToken, RecipeController.deleteRecipe);
router.post("/:id/save", authenticateToken, RecipeController.saveRecipe);
router.delete("/:id/save", authenticateToken, RecipeController.unsaveRecipe);
export default router;
