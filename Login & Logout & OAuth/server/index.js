const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
// Mongoose는 Node.js와 MongoDB를 연결해주는 ODM
const config = require("./config/key");
const bodyParser = require("body-parser");
// 프론트엔드(client) 에서 로그인 정보(email, 아이디, 비밀번호 등)을
// 입력하면 서버에서 받아줘야하는데
// 로그인정보 (Body) 를 분석(parse)해서 req.body로 출력해주는것을 👉 body-parser라고 한다
const cookieParser = require("cookie-parser");
const { User } = require("./model/User");
const { auth } = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: true }));
// 👉 app에서 x-www-form-urlencoded 라는 파일을 분석해서 가져온다
app.use(bodyParser.json());
// 👉 app에서 json파일을 분석해서 가져온다
app.use(cookieParser());

mongoose
  .connect(config.mongoURI)
  //
  .then(() => console.log("MongoDB connected..."))
  // 👉 Node.js 랑 몽고DB 랑 잘연결되었으면 문구 출력
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users/register", (req, res) => {
  // 회원가입할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다

  // {
  //   id: "hello",
  //   password: "123"
  // }
  // req.body 에는 이런 json 파일이 들어있다
  // bodyParser가 변환을 해주기때문에 가능
  const user = new User(req.body);
  // next() 가 오는자리 여기 밑으로 실행된다 👇👇👇👇👇👇👇
  user.save((err, userInfo) => {
    // save는 몽고db 에서 오는 메소드 👉 user에 저장이 되어있다
    if (err) return res.json({ signupSuccess: false, err });
    // user에 저장을 할때 에러가 발생하면
    // json 형식으로 에러가 발생했다는걸 전해준다
    // success: false, 에러메세지
    return res.status(200).json({
      // userInfo에 담긴 정보를 클라이언트로
      // 성공했다는 뜻(200) 을 json형식으로 전해준다
      signupSuccess: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    // 요청된 이메일이 데이터베이스에서 있는지 찾는다
    // 몽고DB 메소드 'findOne'
    if (!user) {
      // User에서 email: req.body.email 으로 요청받은 user 이메일이 없다면
      return res.json({
        // 리턴을 하는데 json 데이터로 응답해준다
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      }); // json 데이터 👆
    }

    user.realPassword(req.body.password, (err, really) => {
      // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다
      // user의 password, 함수실행
      if (!really)
        // req.body.password <ㅡ> userSchema에 비밀번호가 같지 않다면
        return res.json({
          // 리턴을 하는데 json 데이터로 응답해준다
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        }); // json 데이터 👆

      user.getToken((err, userToken) => {
        if (err) return res.status(400).send(err);
        // 실패했다는 뜻(400)
        res
          .cookie("x_auth", userToken.token)
          // 토큰을 저장하는곳을 정한다 쿠키 or 로컬스토리지 or 세션
          // 쿠키에 저장된 이름, 토큰
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
        // 비밀번호까지 맞다면 토큰을 생성해준다
        // json 데이터 👆
      });
    });
  });
});

// auth.js 에서 next() 가 실행된다면
// /api/users/auth", auth, 👈 에러나면 여기서 막힘 ⭐ next 실행시 다음으로 넘어감 👉 (req, res)
app.get("/api/users/auth", auth, (req, res) => {
  // 👇👇👇 여기가 실행된다는 건 👇👇👇
  // 미들웨어를 통과해서 Auth 가 ture 라는 뜻이다
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    // role 0 👉 이면 일반유저 : 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  }); // json 데이터로 반환해준다 👆
});

//--------------로그아웃 Route---------------
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    // 'findOneAndUpdate' 유저를 찾아서 데이터를 업데이트 시킨다
    // 아이디는 auth.js 에서 req.user로 가져와서 찾는다, ⭐ 토큰은 지워준다
    if (err) return res.json({ logoutSuccess: false, error: true });
    // 에러가 발생했다면 json 데이터로 리턴
    return res.status(200).send({ logoutSuccess: true });
    // 성공했다면 (200) json 데이터로 리턴
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
