const Cart = require('../models/Discount');

class DiscountService {
    static async applyDiscount(orderTotal, discountCode) {
      try {
        const discount = await Discount.findOne({ code: discountCode });
        if (!discount) {
          throw new Error('Discount not found');
        }
  
        if (discount.expiresAt < new Date()) {
          throw new Error('Discount has expired');
        }
  
        if (orderTotal < discount.minPrice) {
          throw new Error('Order total does not meet discount requirements');
        }
  
        let discountAmount = 0;
        if (discount.promotionType === 'ByDate') {
          discountAmount = (orderTotal * discount.percentage) / 100;
        } else if (discount.promotionType === 'ByQuantity') {
          if (discount.quantity <= 0) {
            throw new Error('Discount quantity has been exhausted');
          }
          const availableDiscountQuantity = Math.min(discount.quantity, Math.floor(orderTotal / discount.minPrice));
          discountAmount = availableDiscountQuantity * discount.percentage;
          discount.quantity -= availableDiscountQuantity;
        }
  
        // Check if orderTotal exceeds maxPrice
        if (discount.maxPrice && orderTotal > discount.maxPrice) {
          discountAmount = Math.min(discountAmount, discount.maxPrice);
        }
  
        await discount.save();
        return discountAmount;
      } catch (error) {
        throw new Error(`Could not apply discount: ${error.message}`);
      }
    }
  }
  