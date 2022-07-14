const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 비밀번호를 암호화 시키는 모듈 bcrypt
const saltRounds = 10;
// salt의 자리수 설정 = 10 자리
const jwt = require("jsonwebtoken");
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
  let user = this;
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

userSchema.methods.realPassword = function (plainPW, call) {
  // 원래 비밀번호 123450 <ㅡ> 암호화된 비밀번호 x2jaj2L5sgRmjaNBwRmyE...
  // 두개를 비교하여 맞는지 체크해야하는데
  // 암호화된 비밀번호는 다시 복호화할수 없기때문에
  // 체크할 비밀번호를 암호화하여 암호화된 비밀번호랑 비교해야한다
  bcrypt.compare(plainPW, this.password, function (err, really) {
    // req.body.password, userSchema에 비밀번호, 함수실행
    if (err) return call(err); // 비밀번호가 같지 않다면 에러발생
    call(null, really); // 비밀번호를 암호화해서 hash화 된 비밀번호와 같다면
    // 에러는 없고 (null), true를 반환
  });
};

userSchema.methods.getToken = function (caller) {
  // jsonwebtoken(jwt)를 이용해서 token 생성하기

  let user = this;
  // this 는 위에 userSchema로 정의된 json들을 가리킨다 👆👆👆👆

  let token = jwt.sign(user._id.toHexString(), "getLoginToken");
  // 데이터베이스의 고유번호 user의 _id를 가져온다
  // toHexString() 은 순수한 데이터 자체를 가져온다는 뜻

  // user._id + 'getLoginToken' = token
  // 'getLoginToken' 만으로도 token을 가져올수 있기때문에 기억해둬야한다

  user.token = token;
  user.save(function (err, userToken) {
    if (err) return caller(err); // 에러가 있다면 에러발생
    caller(null, userToken);
    // user의 _id에 맞게 token을 잘 받아왔으면 (save)
    // save가 잘 되었을 경우 에러는 없고(null) userToken에 정보를 전달해준다
  });
};

userSchema.statics.findToken = function (token, call) {
  let user = this;

  jwt.verify(token, "getLoginToken", function (err, decode) {
    // verify 는 복호화 시키는 메소드
    // token, 'getLoginToken', 함수실행
    // jwt 토큰을 만들때 같이 생성했던 임의의 이름 'getLoginToken'
    // 👉 user._id + 'getLoginToken' = token

    user.findOne({ _id: decode, token: token }, function (err, user) {
      // 디코드된 아이디, 토큰 값이 데이터베이스에서 있는지 찾는다
      // 몽고DB 메소드 'findOne'
      if (err) return call(err); // 에러가 있다면 에러발생
      call(null, user);
      // 찾은 값이 일치하는경우 에러는 없고(null) user에 정보를 전달해준다
    });
  });
};

const User = mongoose.model("User", userSchema);
// 스키마를 model로 감싸준다

module.exports = { User };
// 스키마를 다른 파일에서도 사용 가능하도록 exports
