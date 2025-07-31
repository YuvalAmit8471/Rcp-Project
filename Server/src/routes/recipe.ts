import express from "express";
import RecipeController from "../controllers/recipe.controller";
import { authenticateToken } from "../middleware/auth";
// import { validateRegisterInput, validateLoginInput } from '../middleware/validation';

const router = express.Router();

// Authentication routes
router.post("/", authenticateToken, RecipeController.create);
router.get("/", RecipeController.findAll);
router.get("/:id", RecipeController.findRecipe);
router.patch("/:id", authenticateToken, RecipeController.updateRecipe);
router.delete("/:id", authenticateToken, RecipeController.deleteRecipe);

export default router;
