const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến người dùng
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến sản phẩm
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Tham chiếu đến đơn hàng
    rating: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1 đến 5 sao
    comment: String, // Bình luận của người dùng
    createdAt: { type: Date, default: Date.now } // Ngày tạo bình luận
});

module.exports = mongoose.model('Review', ReviewSchema);
