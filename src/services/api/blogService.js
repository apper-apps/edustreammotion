import blogPosts from "@/services/mockData/blogPosts.json";

class BlogService {
  constructor() {
    this.data = [...blogPosts];
  }

  // Get all blog posts
  async getAll() {
    await this.delay();
    return [...this.data];
  }

  // Get blog post by ID
  async getById(id) {
    await this.delay();
    return this.data.find(post => post.Id === id) || null;
  }

  // Create new blog post
  async create(post) {
    await this.delay();
    const newId = Math.max(...this.data.map(p => p.Id), 0) + 1;
    const newPost = {
      ...post,
      Id: newId
    };
    this.data.unshift(newPost);
    return newPost;
  }

  // Update blog post
  async update(id, postData) {
    await this.delay();
    const index = this.data.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    this.data[index] = { ...this.data[index], ...postData };
    return this.data[index];
  }

  // Delete blog post
  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    this.data.splice(index, 1);
    return true;
  }

  // Utility method to add delay for realistic loading
  delay(ms = Math.random() * 300 + 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const blogService = new BlogService();