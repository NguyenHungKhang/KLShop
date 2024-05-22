const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    expiresAt: { type: Date, required: true },
    startDate: { type: Date, required: true },
    image: String,
    quantity: { type: Number, default: 0 },
    promotionType: { type: String, enum: ['ByDate', 'ByQuantity'], required: true },
    minPrice: { type: Number, required: true },
    maxPrice: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discount', DiscountSchema);
