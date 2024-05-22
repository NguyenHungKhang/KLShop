const Cart = require('../models/Cart');

class CartService {
  static async addToCart(userId, product, variant, quantity) {
    try {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
      const existingItemIndex = cart.items.findIndex(item =>
        item.product.equals(product) && 
        item.variant.color === variant.color &&
        item.variant.size === variant.size
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, variant, quantity, price: product.price });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Could not add to cart');
    }
  }

  static async updateCartItemQuantity(userId, productId, variant, quantity) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const item = cart.items.find(item =>
        item.product.equals(productId) && 
        item.variant.color === variant.color &&
        item.variant.size === variant.size
      );

      if (!item) {
        throw new Error('Item not found in cart');
      }

      item.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Could not update cart item quantity');
    }
  }

  static async removeFromCart(userId, productId, variant) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.items = cart.items.filter(item =>
        !item.product.equals(productId) || 
        item.variant.color !== variant.color ||
        item.variant.size !== variant.size
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Could not remove from cart');
    }
  }

  static async getCartByUserId(userId) {
    try {
      return await Cart.findOne({ user: userId }).populate('items.product');
    } catch (error) {
      throw new Error('Could not get cart');
    }
  }

  static async calculateCartTotal(userId) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      let total = 0;
      for (const item of cart.items) {
        total += item.price * item.quantity;
      }
      return total;
    } catch (error) {
      throw new Error('Could not calculate cart total');
    }
  }
}

module.exports = CartService;
