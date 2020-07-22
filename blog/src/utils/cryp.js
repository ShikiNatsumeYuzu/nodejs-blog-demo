const crypto = require("crypto");

// 密匙
const SECREY_KEY = "WJiol_8776#";

// md5
function md5(content) {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECREY_KEY}`;
  return md5(str);
}

module.exports = {
  genPassword
};
