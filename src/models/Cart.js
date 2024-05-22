const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: {
        color: { type: String, required: true },
        size: { type: String, required: true }
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

CartSchema.virtual('total').get(function () {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

module.exports = mongoose.model('Cart', CartSchema);
