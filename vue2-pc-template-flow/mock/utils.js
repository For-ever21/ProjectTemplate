/**
 * @description 将 url 上的查询参数 转换成对象
 * @param url
 * @example
 *  let url = www.baidu.com?a=3&b=4
 *  obj2UrlParams(url)
 *  ==> {a: '3', b: '4'}
 */
function urlParams2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

module.exports = { urlParams2Obj };
