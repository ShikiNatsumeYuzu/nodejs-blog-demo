var express = require("express");
var router = express.Router();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");

// 博客列表
router.get("/list", (req, res) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === undefined) {
      // 未登录
      res.json(new ErrorModel("未登录"));
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  return getList(author, keyword).then(listData => res.json(new SuccessModel(listData)));
});

// 博客详情
router.get("/detail", (req, res) => {
  return getDetail(req.query.id).then(data => res.json(new SuccessModel(data)));
});

// 新建博客
router.post("/new", loginCheck, (req, res) => {
  req.body.author = req.session.username;
  return newBlog(req.body).then(data => res.json(new SuccessModel(data)));
});

// 更新博客
router.post("/update", loginCheck, (req, res) => {
  return updateBlog(req.query.id, req.body).then(val => res.json(val ? new SuccessModel("更新博客成功") : new ErrorModel("更新博客失败")));
});

// 删除博客
router.post("/del", loginCheck, (req, res) => {
  const author = req.session.username;
  return delBlog(req.query.id, author).then(val => res.json(val ? new SuccessModel("删除博客成功") : new ErrorModel("删除博客失败")));
});

module.exports = router;
