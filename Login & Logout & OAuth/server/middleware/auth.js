// 인증 처리를 해주는 공간

const { User } = require("../model/User");

// 토큰을 복호화 한 후 유저를 찾는다

// 유저가 있으면 인증 ok

// 유저가 없으면 인증 no

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;
  // 클라이언트 쿠키에서 토큰을 가져온다
  // 'x_auth' 는 index.js에서 쿠키를 생성할때 임의로 지은 이름
  User.findToken(token, (err, user) => {
    if (err) throw err; // 에러가 있다면 에러발생
    if (!user) return res.json({ isAuth: false, error: true });
    // user값이(token) 없으면 리턴을 하는데 json 데이터로 응답해준다

    req.token = token; // 요청된 token이 있으면 token 에 담음
    req.user = user; // 요청된 user가 있으면 user 에 담음
    // ⭐req.token⭐ / ⭐req.user⭐ 으로 정의해줌으로써 index.js에서도 가져다 쓸수 있다
    next();
  });
};

module.exports = { auth };
