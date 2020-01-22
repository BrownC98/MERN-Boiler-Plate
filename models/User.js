const mongoose = require('mongoose');

const UserRole = {
    user: 0,
    admin: 1
}

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: UserRole.user
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { // 토크 유효기간
        type: Number
    }
})
// schema를 model로 감싼다
const User = mongoose.model('User', UserSchema);

// 외부파일에서 사용가능하도록 던진다
module.exports = { User }