import express from "express";
import ReviewController from "../controllers/review.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Create a review for a recipe (requires authentication)
router.post(
  "/recipe/:recipeId",
  authenticateToken,
  ReviewController.createReview
);

// Get all reviews for a specific recipe (public)
router.get("/recipe/:recipeId", ReviewController.getRecipeReviews);

// Get a specific review by ID (public)
router.get("/:id", ReviewController.getReviewById);

// Update a review (requires authentication and ownership)
router.put("/:id", authenticateToken, ReviewController.updateReview);

// Delete a review (requires authentication and ownership)
router.delete("/:id", authenticateToken, ReviewController.deleteReview);

export default router;
