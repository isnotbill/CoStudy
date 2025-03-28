const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    profilePicture: {
        url: {
            type: String,
            required: true,
            default: 'https://res.cloudinary.com/danxaoae0/image/upload/v1742871587/default_zkhpfk.jpg'
        },
        publicId: {
            type: String,
            required: true,
            default: 'default_zkhpfk'
        }
    },
    refreshToken: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
