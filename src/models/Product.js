const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [String],
    variants: [VariantSchema]
});

module.exports = mongoose.model('Product', ProductSchema);
