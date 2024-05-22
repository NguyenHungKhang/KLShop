const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile: {
        name: String,
        address: String,
        phone: String
    },
    role: { type: String, default: 'USER' },
    emailVerified: { type: Boolean, default: false }, // Trường xác nhận email
    emailVerificationToken: String, // Mã token dùng cho việc xác nhận email
    emailVerificationTokenExpires: Date // Thời gian hết hạn của token
});

module.exports = mongoose.model('User', UserSchema);
