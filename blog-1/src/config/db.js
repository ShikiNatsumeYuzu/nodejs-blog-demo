const env = process.env.NODE_ENV; // 环境变量

// 配置
let MYSQL_CONFIG;
let REDIS_CONFIG;

if (env === "dev") {
  // mysql
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "myblog"
  };

  // redis
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1"
  };
}

if (env === "production") {
  // mysql
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "myblog"
  };

  // redis
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1"
  };
}

module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG
};
