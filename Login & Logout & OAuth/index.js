const express = require("express");
// node js 의 라이브러리 express
const app = express();
const port = 5000;
const mongoose = require("mongoose");
// Mongoose는 Node.js와 MongoDB를 연결해주는 ODM

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
