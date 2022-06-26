module.exports = {
  mongoURI: process.env.MONGO_URI,
};
// 몽고DB 에서나온 connect 주소 + 비밀번호를 👉 HEROKU 에 담아놓는다
// 👉 배포가 된 후 환경에서 mongoURI 를 사용할 경우
