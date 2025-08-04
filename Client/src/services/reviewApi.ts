/**
 * Review API Service
 * Centralized API calls for review-related operations
 */

import api from "@/lib/api";
import type { Review } from "@/types/Review";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const reviewApi = {
  /**
   * Fetch all reviews from the database for a specific recipe
   */
  async getRecipeReviews(recipeId: string): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(
      `/api/reviews/recipe/${recipeId}`
    );
    return response.data.success ? response.data.data : [];
  },

  /**
   * Create a new review for a recipe
   */
  async createReview(
    recipeId: string,
    reviewData: {
      userId: string;
      username: string;
      rating: number;
      comment: string;
    }
  ): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(
      `/api/reviews/recipe/${recipeId}`,
      reviewData
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create review");
    }
    return response.data.data;
  },

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    reviewData: Partial<Review>
  ): Promise<Review> {
    const response = await api.put<ApiResponse<Review>>(
      `/api/reviews/${reviewId}`,
      reviewData
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update review");
    }
    return response.data.data;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<null>>(
      `/api/reviews/${reviewId}`
    );
    return response.data.success;
  },
};
