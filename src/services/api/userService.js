import users from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.data = [...users];
  }

  // Get all users
  async getAll() {
    await this.delay();
    return [...this.data];
  }

  // Get user by ID
  async getById(id) {
    await this.delay();
    return this.data.find(user => user.Id === id) || null;
  }

  // Create new user
  async create(user) {
    await this.delay();
    const newId = Math.max(...this.data.map(u => u.Id), 0) + 1;
    const newUser = {
      ...user,
      Id: newId,
      joinedAt: new Date().toISOString()
    };
    this.data.push(newUser);
    return newUser;
  }

  // Update user
  async update(id, userData) {
    await this.delay();
    const index = this.data.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.data[index] = { ...this.data[index], ...userData };
    return this.data[index];
  }

  // Delete user
  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.data.splice(index, 1);
    return true;
  }

  // Utility method to add delay for realistic loading
  delay(ms = Math.random() * 300 + 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();