const querystring = require("querystring");
const { get, set } = require("./src/db/redis");
const { access } = require("./src/utils/log");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 获取cookie的过期时间
const getCookieExpires = () => {
  const date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  return date.toGMTString();
};

// session数据
// const SESSION_DATA = {};

// 用于处理 post data
const getPostData = req => {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") return resolve({});
    if (req.headers["content-type"] !== "application/json") return resolve({});
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) return resolve({});
      resolve(JSON.parse(postData));
    });
  });
};

const serverHandle = (req, res) => {
  // 记录 access log
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}`
  );

  // 设置返回格式
  res.setHeader("Content-Type", "application/json");

  // 获取path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析query
  req.query = querystring.parse(url.split("?")[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) return;
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 解析 session
  // let needSetCookie = false;
  // let userId = req.cookie.userid;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // req.session = SESSION_DATA[userId];

  // 解析 session (使用redis)
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的session值
    set(userId, {});
  }

  // 获取 session
  req.sessionId = userId;
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData == null) {
        // 初始化 redis 中的 session 值
        set(req.sessionId, {});
        // 设置session
        req.session = {};
      } else {
        // 设置session
        req.session = sessionData;
      }

      // 处理post data
      return getPostData(req);
    })
    .then(postData => {
      req.body = postData;

      // 处理blog路由
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              "Set-cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      // 处理user路由
      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              "Set-cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 未命中路由 返回404
      res.writeHead(404, {
        "Content-type": "text/plain"
      });
      res.write("404 Not Found");
      res.end();
    });
};

module.exports = serverHandle;
