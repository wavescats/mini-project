const express = require("express");
// node js 의 라이브러리 express
const app = express();
const port = 5000;
const mongoose = require("mongoose");
// Mongoose는 Node.js와 MongoDB를 연결해주는 ODM
const bodyParser = require("body-parser");
const { User } = require("./model/User");

app.use(bodyParser.urlencoded({ extended: true }));
// 👉 app에서 x-www-form-urlencoded 라는 파일을 분석해서 가져온다
app.use(bodyParser.json());
// 👉 app에서 json파일을 분석해서 가져온다

mongoose
  .connect(config.mongoURI)
  //
  .then(() => console.log("MongoDB connected..."))
  // 👉 Node.js 랑 몽고DB 랑 잘연결되었으면 문구 출력
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
  // localhost:5000/ 주소로 접속되었을때 "Hello World!" 문구가 출력된다
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
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
