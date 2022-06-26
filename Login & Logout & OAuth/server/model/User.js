const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    // 아이디
    type: String,
    maxlength: 50,
    // 최대 50글자를 넘지못하게
  },
  email: {
    type: String,
    trim: true,
    // trim 의 역할은
    // wave cat@naver.com 에서
    // wavecat@naver.com 으로 빈칸을 없애주는 역할을 한다
    unique: 1,
    // unique는 똑같은 이메일을 쓰지못하게 한다는 뜻
  },
  password: {
    type: String,
    minlength: 5,
    // 최소 5글자는 넘게
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    // 관리자의 권한을 준다는 의미
    // ex) 0은 사용자 / 1은 관리자 등
    default: 0,
    // 타입을 지정하지 않으면 기본값은 0으로 주겠다
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
    // 토큰의 유효기간을 설정해줄수 있다
  },
});

const User = mongoose.model("User", userSchema);
// 스키마를 model로 감싸준다

module.exports = { User };
// 스키마를 다른 파일에서도 사용 가능하도록 exports
