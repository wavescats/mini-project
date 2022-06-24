const express = require("express");
// node js 의 라이브러리 express
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
  // localhost:5000/ 주소로 접속되었을때 "Hello World!" 문구가 출력된다
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
