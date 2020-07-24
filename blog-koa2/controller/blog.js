const xss = require("xss");
const { exec } = require("../db/mysql");

// 博客列表
const getList = async (author, keyword) => {
  let sql = "select * from blogs where 1=1 ";
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += "order by createtime desc;";
  // 返回promise
  return await exec(sql);
};

// 博客详情
const getDetail = async id => {
  const sql = `select * from blogs where id='${id}';`;
  const rows = await exec(sql);
  return rows[0];
};

// 新建博客
const newBlog = async (blogData = {}) => {
  const { title, content, author } = blogData;
  const createtime = Date.now();
  const sql = `
    insert into blogs (title,content,createtime,author) values ('${xss(title)}','${xss(content)}',${createtime},'${author}');
  `;
  const insertData = await exec(sql);
  return { id: insertData.insertId };
};

// 更新博客
const updateBlog = async (id, blogData = {}) => {
  const { title, content } = blogData;
  const sql = `
    update blogs set title='${xss(title)}', content='${xss(content)}' where id=${id};
  `;
  const { affectedRows } = await exec(sql);
  return Boolean(affectedRows);
};

// 删除博客
const delBlog = async (id, author) => {
  const sql = `delete from blogs where id=${id} and author='${author}';`;
  const { affectedRows } = await exec(sql);
  return Boolean(affectedRows);
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
