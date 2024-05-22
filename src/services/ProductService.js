const Product = require('../models/Product');

class ProductService {
  static async getProducts(options) {
    try {
      const filters = options.filters || {};

      const totalItems = await Product.countDocuments(filters);

      const query = Product.find(filters).populate('category');

      if (options.selectFields) {
        query.select(options.selectFields);
      }

      const page = options.page || 1;
      const limit = options.limit || 10;
      query.skip((page - 1) * limit).limit(limit);

      const products = await query.exec();

      const totalPages = Math.ceil(totalItems / limit);

      return {
        totalItems,
        totalPages,
        currentPage: page,
        products
      };
    } catch (error) {
      throw new Error('Could not fetch products');
    }
  }

  static async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error('Could not create product');
    }
  }

  static async getProductById(productId) {
    try {
      return await Product.findById(productId).populate('category');
    } catch (error) {
      throw new Error('Could not find product');
    }
  }

  static async updateProduct(productId, updatedData) {
    try {
      return await Product.findByIdAndUpdate(productId, updatedData, { new: true }).populate('category');
    } catch (error) {
      throw new Error('Could not update product');
    }
  }

  static async deleteProduct(productId) {
    try {
      return await Product.findByIdAndDelete(productId).populate('category');
    } catch (error) {
      throw new Error('Could not delete product');
    }
  }
}

module.exports = ProductService;
