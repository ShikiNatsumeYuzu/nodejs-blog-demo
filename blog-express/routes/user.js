var express = require("express");
var router = express.Router();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  return login(username, password).then(data => {
    if (data.username) {
      // 设置session
      req.session.username = data.username;
      req.session.realname = data.realname;

      res.json(new SuccessModel("登录成功"));
    } else {
      res.json(new ErrorModel("登录失败"));
    }
  });
});

// router.get("/login-test", (req, res) => {
//   if (req.session.username) {
//     res.json({ errno: 0, msg: "已登录" });
//   } else {
//     res.json({ errno: -1, msg: "未登录" });
//   }
// });

// router.get("/session-test", (req, res) => {
//   const session = req.session;
//   if (session.viewNum == null) {
//     session.viewNum = 0;
//   }
//   session.viewNum++;
//   res.json({ viewNum: session.viewNum });
// });

module.exports = router;
