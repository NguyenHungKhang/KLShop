const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên của danh mục
    description: String, // Mô tả của danh mục (tùy chọn)
    createdAt: { type: Date, default: Date.now } // Ngày tạo danh mục
});

module.exports = mongoose.model('Category', CategorySchema);
