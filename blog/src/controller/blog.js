const xss = require("xss");
const { exec } = require("../db/mysql");

const getList = (author, keyword) => {
  let sql = "select * from blogs where 1=1 ";
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += "order by createtime desc;";
  // 返回promise
  return exec(sql);
};

const getDetail = id => {
  const sql = `select * from blogs where id='${id}';`;
  return exec(sql).then(rows => rows[0]);
};

const newBlog = (blogData = {}) => {
  const { title, content, author } = blogData;
  const createtime = Date.now();
  const sql = `
    insert into blogs (title,content,createtime,author) values ('${xss(title)}','${xss(content)}',${createtime},'${author}');
  `;
  return exec(sql).then(insertData => ({ id: insertData.insertId }));
};

const updateBlog = (id, blogData = {}) => {
  const { title, content } = blogData;
  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id};
  `;

  return exec(sql).then(({ affectedRows }) => Boolean(affectedRows));
};

const delBlog = (id, author) => {
  const sql = `delete from blogs where id=${id} and author='${author}';`;

  return exec(sql).then(({ affectedRows }) => Boolean(affectedRows));
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
