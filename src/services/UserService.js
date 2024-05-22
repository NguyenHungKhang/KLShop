const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

class UserService {
    static async registerUser(username, password, email, name, address, phone) {
        try {
            const token = crypto.randomBytes(20).toString('hex');
            const tokenExpires = Date.now() + 3600000;

            const user = new User({
                username,
                password,
                email,
                profile: { name, address, phone },
                emailVerificationToken: token,
                emailVerificationTokenExpires: tokenExpires
            });

            // Gửi email xác nhận
            await UserService.sendVerificationEmail(email, token);

            return await user.save();
        } catch (error) {
            throw new Error('Could not register user: ' + error.message);
        }
    }

    static async sendVerificationEmail(email, token) {
        // const transporter = nodemailer.createTransport({
        //     // Cấu hình transporter để gửi email, ví dụ như Gmail, SendGrid, etc.
        // });

        // const mailOptions = {
        //     from: 'your-email@example.com',
        //     to: email,
        //     subject: 'Email Verification',
        //     text: `Please click the following link to verify your email: ${process.env.BASE_URL}/verify-email?token=${token}`
        // };

        // await transporter.sendMail(mailOptions);
    }

    static async verifyEmail(token) {
        try {
            const user = await User.findOne({ emailVerificationToken: token, emailVerificationTokenExpires: { $gt: Date.now() } });
            if (!user) {
                throw new Error('Invalid or expired verification token');
            }

            user.emailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationTokenExpires = undefined;

            await user.save();
            return user;
        } catch (error) {
            throw new Error('Could not verify email: ' + error.message);
        }
    }

    static async loginUser(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('Invalid username');
            }

            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            return user;
        } catch (error) {
            throw new Error('Could not login user: ' + error.message);
        }
    }
}

module.exports = UserService;
