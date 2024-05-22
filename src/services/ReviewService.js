const Review = require('../models/Review');

class ReviewService {
  static async createReview(userId, productId, orderId, rating, comment) {
    try {
      const review = new Review({
        user: userId,
        product: productId,
        order: orderId,
        rating,
        comment
      });
      return await review.save();
    } catch (error) {
      throw new Error('Could not create review: ' + error.message);
    }
  }

  static async getReviewsByProduct(productId) {
    try {
      return await Review.find({ product: productId }).populate('user');
    } catch (error) {
      throw new Error('Could not fetch reviews: ' + error.message);
    }
  }

  static async getReviewsByUser(userId) {
    try {
      return await Review.find({ user: userId }).populate('product');
    } catch (error) {
      throw new Error('Could not fetch reviews: ' + error.message);
    }
  }
  
  static async updateReview(reviewId, rating, comment) {
    try {
      return await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
    } catch (error) {
      throw new Error('Could not update review: ' + error.message);
    }
  }

  static async deleteReview(reviewId) {
    try {
      return await Review.findByIdAndDelete(reviewId);
    } catch (error) {
      throw new Error('Could not delete review: ' + error.message);
    }
  }
}

module.exports = ReviewService;
