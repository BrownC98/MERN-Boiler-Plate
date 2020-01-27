const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
// mongoose 에서 제공하는 전처리 함수
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        // 비번 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

UserSchema.methods.generateToken = function (cb) {

    var user = this;
    // jsonwebtoken을 이용해서 token 생성하기
    // db 레코드 id 를 의미함
    var token = jwt.sign(user._id.toHexString(), 'SecretToken');
    // user._id + 'secretToken' = token
    // 토큰 해석기에 'secretToken' 을 넣으면 user._id 를 알 수가 있음

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

UserSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰을 decode한다.
    jwt.verify(token, 'SecretToken', function (err, decoded) {
        // DB에 decoded 값(_id)이 있는지 확인
        // 클라이언트 토큰과 DB에 저장된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
}

// schema를 model로 감싼다
const User = mongoose.model('User', UserSchema);

// 외부파일에서 사용가능하도록 던진다
module.exports = {  User, UserRole }