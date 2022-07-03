const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 비밀번호를 암호화 시키는 모듈 bcrypt
const saltRounds = 10;
// salt의 자리수 설정 = 10 자리
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

userSchema.pre("save", function (next) {
  // 몽구스의 메소드 'pre'
  // 유저의 정보롤 userSchema에 "save"(저장) 하기 전에 함수를 실행한다
  // 어디에서 실행되는지 index.js 에서 자리표시
  var user = this;
  // this 는 위에 userSchema로 정의된 json들을 가리킨다 👆👆👆👆

  if (user.isModified("password")) {
    // userSchema로 비밀번호가 입력될때(변할때)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // salt를 만든다 👉 salt의 자리수 10 자리
      if (err) return next(err);
      // err 발생하면 index.js 에 err를 그대로 출력

      bcrypt.hash(user.password, salt, function (err, hash) {
        // user의 password를 hash화 시키고, salt 생성, 함수 실행
        if (err) return next(err);
        // err 발생하면 index.js 에 err를 그대로 출력
        user.password = hash; // 비밀번호를 해쉬화 성공했을경우
        next(); // index.js에 성공(200)을 실행
      });
    });
  } else {
    next();
    // 비밀번호가 아니라 다른걸 입력할때 (바꿀때는) 그냥 next() 실행
  }
});

const User = mongoose.model("User", userSchema);
// 스키마를 model로 감싸준다

module.exports = { User };
// 스키마를 다른 파일에서도 사용 가능하도록 exports
