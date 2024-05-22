const Category = require('../models/Category');

class CategoryService {
  static async createCategory(name, description) {
    try {
      const category = new Category({ name, description });
      return await category.save();
    } catch (error) {
      throw new Error('Could not create category: ' + error.message);
    }
  }

  static async getAllCategories() {
    try {
      return await Category.find();
    } catch (error) {
      throw new Error('Could not fetch categories: ' + error.message);
    }
  }

  static async getCategoryById(categoryId) {
    try {
      return await Category.findById(categoryId);
    } catch (error) {
      throw new Error('Could not find category: ' + error.message);
    }
  }

  static async updateCategory(categoryId, name, description) {
    try {
      return await Category.findByIdAndUpdate(categoryId, { name, description }, { new: true });
    } catch (error) {
      throw new Error('Could not update category: ' + error.message);
    }
  }

  static async deleteCategory(categoryId) {
    try {
      return await Category.findByIdAndDelete(categoryId);
    } catch (error) {
      throw new Error('Could not delete category: ' + error.message);
    }
  }
}

module.exports = CategoryService;
