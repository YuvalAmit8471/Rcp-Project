/**
 * Review API Service
 * Centralized API calls for review-related operations
 */

import api from "@/lib/api";
import type { Review } from "@/types/Review";

// Generic API response used by other services
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Server controller shapes
interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
  };
  stats: { averageRating: number; totalReviews: number };
}

interface MessageOnlyResponse {
  message: string;
}

interface SingleReviewResponse {
  message?: string;
  review: Review;
}

function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return "success" in obj;
}

function isSingleReviewResponse(data: unknown): data is SingleReviewResponse {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return "review" in obj;
}

function isMessageOnly(data: unknown): data is MessageOnlyResponse {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return "message" in obj;
}

// Lightweight in-memory cache for stats per recipe
const __reviewStatsCache = new Map<
  string,
  { averageRating: number; totalReviews: number }
>();

export const reviewApi = {
  /**
   * Fetch all reviews for a specific recipe
   */
  async getRecipeReviews(recipeId: string): Promise<ReviewsResponse> {
    const { data } = await api.get(`/api/reviews/recipe/${recipeId}`);

    if (isApiResponse<ReviewsResponse>(data)) {
      const payload = data.data;
      return (
        payload || {
          reviews: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalReviews: 0,
            limit: 10,
          },
          stats: { averageRating: 0, totalReviews: 0 },
        }
      );
    }

    return (
      (data as ReviewsResponse) || {
        reviews: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalReviews: 0,
          limit: 10,
        },
        stats: { averageRating: 0, totalReviews: 0 },
      }
    );
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
    const { data } = await api.post(
      `/api/reviews/recipe/${recipeId}`,
      reviewData
    );

    if (isSingleReviewResponse(data)) return data.review;
    if (isApiResponse<Review>(data)) return data.data;

    throw new Error(
      isMessageOnly(data) ? data.message : "Failed to create review"
    );
  },

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    reviewData: Partial<Review>
  ): Promise<Review> {
    const { data } = await api.put(`/api/reviews/${reviewId}`, reviewData);

    if (isSingleReviewResponse(data)) return data.review;
    if (isApiResponse<Review>(data)) return data.data;

    throw new Error(
      isMessageOnly(data) ? data.message : "Failed to update review"
    );
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    const { data } = await api.delete(`/api/reviews/${reviewId}`);

    if (isApiResponse<null>(data)) return data.success;
    if (isMessageOnly(data)) return true;

    return false;
  },

  /** Get only stats for a recipe (average rating and total reviews) */
  async getRecipeReviewStats(recipeId: string): Promise<{
    averageRating: number;
    totalReviews: number;
  }> {
    if (__reviewStatsCache.has(recipeId)) {
      return __reviewStatsCache.get(recipeId)!;
    }
    const res = await this.getRecipeReviews(recipeId);
    const stats = {
      averageRating: res.stats?.averageRating ?? 0,
      totalReviews: res.stats?.totalReviews ?? res.reviews?.length ?? 0,
    };
    __reviewStatsCache.set(recipeId, stats);
    return stats;
  },
};
