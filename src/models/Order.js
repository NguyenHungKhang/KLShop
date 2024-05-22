const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', required: true }, // ID của discount
    discountAmount: { type: Number, required: true } // Lượng discount
});

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: {
        color: { type: String, required: true },
        size: { type: String, required: true }
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    discount: DiscountSchema, // Đối tượng discount
    status: { type: String, default: 'Pending' }, // Pending, Processing, Shipped, Delivered, Cancelled
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

OrderSchema.virtual('total').get(function () {
    return this.totalAmount - (this.discount ? this.discount.discountAmount : 0); // Tính tổng bằng cách trừ đi lượng discount
});

module.exports = mongoose.model('Order', OrderSchema);
