import { Response } from "express";
import mongoose from "mongoose";
import RecipeModel from "../models/Recipe";
import User from "../models/User";
import Review from "../models/Review";
import { AuthRequest } from "../middleware/auth";

const ReviewController = {
  // Create a new review for a recipe
  async createReview(req: AuthRequest, res: Response) {
    try {
      const { recipeId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.userId;

      // Validate input
      if (!rating || !comment) {
        return res.status(400).json({
          message: "Rating and comment are required",
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Check if recipe exists
      const recipe = await RecipeModel.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Get user information
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has already reviewed this recipe
      const existingReview = await Review.findOne({
        recipe: recipeId,
        user: userId,
      });

      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this recipe",
        });
      }

      // Create new review
      const newReview = new Review({
        rating,
        comment,
        recipe: recipeId,
        user: userId,
        userName: user.name || user.email,
      });

      await newReview.save();

      // Populate user and recipe data for response
      await newReview.populate("user", "name email");
      await newReview.populate("recipe", "title");

      res.status(201).json({
        message: "Review created successfully",
        review: newReview,
      });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all reviews for a specific recipe
  async getRecipeReviews(req: AuthRequest, res: Response) {
    try {
      const { recipeId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Check if recipe exists
      const recipe = await RecipeModel.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Get reviews with pagination
      const reviews = await Review.find({ recipe: recipeId })
        .populate("user", "name email")
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalReviews = await Review.countDocuments({ recipe: recipeId });

      // Calculate average rating
      const ratingStats = await Review.aggregate([
        { $match: { recipe: new mongoose.Types.ObjectId(recipeId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      const averageRating =
        ratingStats.length > 0 ? ratingStats[0].averageRating : 0;

      res.status(200).json({
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          limit,
        },
        stats: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
        },
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update a review (only by the user who created it)
  async updateReview(req: AuthRequest, res: Response) {
    try {
      const { id: reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.userId;

      // Validate input
      if (!rating && !comment) {
        return res.status(400).json({
          message: "Rating or comment is required for update",
        });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Find the review
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if the user owns this review
      if (review.user.toString() !== userId?.toString()) {
        return res.status(403).json({
          message: "You can only update your own reviews",
        });
      }

      // Update the review
      const updateData: any = {};
      if (rating) updateData.rating = rating;
      if (comment) updateData.comment = comment;

      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        updateData,
        { new: true, runValidators: true }
      )
        .populate("user", "name email")
        .populate("recipe", "title");

      res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a review (only by the user who created it)
  async deleteReview(req: AuthRequest, res: Response) {
    try {
      const { id: reviewId } = req.params;
      const userId = req.user?.userId;

      // Find the review
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if the user owns this review
      if (review.user.toString() !== userId?.toString()) {
        return res.status(403).json({
          message: "You can only delete your own reviews",
        });
      }

      // Delete the review
      await Review.findByIdAndDelete(reviewId);

      res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get a specific review by ID
  async getReviewById(req: AuthRequest, res: Response) {
    try {
      const { id: reviewId } = req.params;

      const review = await Review.findById(reviewId)
        .populate("user", "name email")
        .populate("recipe", "title");

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ review });
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default ReviewController;
