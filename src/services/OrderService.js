const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Discount');

class OrderService {
    static async createOrder(userId, items, discountCode) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let totalAmount = 0;
            for (let item of items) {
                const product = await Product.findById(item.product).session(session);
                const variant = product.variants.find(v => v.color === item.variant.color && v.size === item.variant.size);
                if (!variant) {
                    throw new Error('Variant not found');
                }
                totalAmount += variant.price * item.quantity;

                if (variant.quantity < item.quantity) {
                    throw new Error('Not enough quantity');
                }
                variant.quantity -= item.quantity;
                await product.save({ session });
            }

            let discountId;
            let discountAmount = 0;
            if (discountCode) {
                const discount = await Discount.findOne({ code: discountCode });
                if (!discount) {
                    throw new Error('Discount not found');
                }

                discountId = discount._id;
                discountAmount = await DiscountService.applyDiscount(totalAmount, discountCode);
            }

            const order = new Order({
                user: userId,
                items: items.map(item => ({
                    product: item.product,
                    variant: item.variant,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount,
                discount: {
                    discountId,
                    discountAmount
                }
            });
            await order.save({ session });
            await session.commitTransaction();
            session.endSession();
            return order;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error('Could not create order: ' + error.message);
        }
    }

    // Các phương thức khác của OrderService...
    

    static async getOrdersByUser(userId, page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .populate('user')
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        throw new Error('Could not fetch orders: ' + error.message);
    }
}

    static async getAllOrders(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const orders = await Order.find()
            .populate('items.product')
            .populate('user')
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        throw new Error('Could not fetch orders: ' + error.message);
    }
}


    static async getOrderById(orderId) {
    try {
        return await Order.findById(orderId).populate('items.product').populate('user');
    } catch (error) {
        throw new Error('Could not find order: ' + error.message);
    }
}

    static async updateOrderStatus(orderId, status) {
    try {
        return await Order.findByIdAndUpdate(orderId, { status, updatedAt: Date.now() }, { new: true });
    } catch (error) {
        throw new Error('Could not update order status: ' + error.message);
    }
}

    static async deleteOrder(orderId) {
    try {
        return await Order.findByIdAndDelete(orderId);
    } catch (error) {
        throw new Error('Could not delete order: ' + error.message);
    }
}
}

module.exports = OrderService;
