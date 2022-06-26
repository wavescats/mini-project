if (process.env.NODE_ENV === "production") {
  // "production" 은 배포가 되었다는 것
  // 만약 배포가 되었으면 prod.js 에서 가져오고
  module.exports = require("./prod");
} else {
  // local 환경이면 dev.js 에서 가져와라
  module.exports = require("./dev");
}
