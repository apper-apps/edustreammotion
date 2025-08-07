import reviews from "@/services/mockData/reviews.json";

class ReviewService {
  constructor() {
    this.data = [...reviews];
  }

  // Get all reviews
  async getAll() {
    await this.delay();
    return [...this.data];
  }

  // Get review by ID
  async getById(id) {
    await this.delay();
    return this.data.find(review => review.Id === id) || null;
  }

  // Create new review
  async create(review) {
    await this.delay();
    const newId = Math.max(...this.data.map(r => r.Id), 0) + 1;
    const newReview = {
      ...review,
      Id: newId
    };
    this.data.unshift(newReview);
    return newReview;
  }

  // Update review
  async update(id, reviewData) {
    await this.delay();
    const index = this.data.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    this.data[index] = { ...this.data[index], ...reviewData };
    return this.data[index];
  }

  // Delete review
  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    this.data.splice(index, 1);
    return true;
  }

  // Utility method to add delay for realistic loading
  delay(ms = Math.random() * 300 + 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const reviewService = new ReviewService();