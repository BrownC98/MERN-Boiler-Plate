const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리

    // 클라이언트 쿠키에서 토큰을 가져온다. (쿠키 파서를 사용한다.)
    // 쿠키를 사용해서 현재 로그아웃 하려는 유저를 식별한다.
    let token = req.cookies.x_auth;
    // 토큰을 복호화 한후 유저(._id)를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        // 다음 콜백에서 토큰과 사용자 정보를 이용할 수 있게끔 함
        req.token = token;
        req.user = user;
        next(); // 미들웨어에서 다음 콜백으로 문맥이 넘어가도록 함
    });
    // 유저가 있으면 인증 OK

    // 없으면 인증 불가
}

module.exports = { auth };