function getDate(createtime) {
  const date = new Date(createtime);
  const getYear = date.getFullYear();
  const getMonth = date.getMonth() + 1;
  const getDate = date.getDate();
  return `${getYear}-${getMonth}-${getDate}`;
}
