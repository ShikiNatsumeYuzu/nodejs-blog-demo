var express = require("express");
var router = express.Router();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");

// 博客列表
router.get("/list", async (req, res) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(new ErrorModel("未登录"));
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);
  const listData = await result;
  return res.json(new SuccessModel(listData));
});

// 博客详情
router.get("/detail", async (req, res) => {
  const result = getDetail(req.query.id);
  const data = await result;
  return res.json(new SuccessModel(data));
});

// 新建博客
router.post("/new", loginCheck, async (req, res) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  const data = await result;
  return res.json(new SuccessModel("创建成功"));
});

// 更新博客
router.post("/update", loginCheck, async (req, res) => {
  const result = updateBlog(req.query.id, req.body);
  const val = await result;
  return res.json(val ? new SuccessModel("更新博客成功") : new ErrorModel("更新博客失败"));
});

// 删除博客
router.post("/del", loginCheck, async (req, res) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  const val = await result;
  return res.json(val ? new SuccessModel("删除博客成功") : new ErrorModel("删除博客失败"));
});

module.exports = router;
