/*
 * @Author         : Qiao
 * @Date           : 2021-03-18 10:31:23
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-25 17:12:58
 * @FilePath       : /src/utils/index.ts
 * @Description    : 通用方法
 */
import { isAccountExist } from "@/modules/account/api";
/**
 * @description: 是否为object
 * @param {any} obj
 * @return {*}
 */
export function isObject(obj: any): any {
  return Object.prototype.toString.call(obj) == "[object Object]";
}

export function isArray(obj: any) {
  return Object.prototype.toString.call(obj) == "[object Array]";
}

export function isString(obj: any) {
  return Object.prototype.toString.call(obj) == "[object String]";
}

export function isNumber(obj: any) {
  return Object.prototype.toString.call(obj) == "[object Number]";
}

export function isFunction(obj: any) {
  return Object.prototype.toString.call(obj) == "[object Function]";
}

/**
 * @description: 删除或者替换url指定query参数
 * @param {string} url 需要处理的链接
 * @param {string} tag 需要替换的参数名
 * @param {string} newValue 需要替换的参数值 不传则表示去除该参数
 * @return {string} 处理之后的链接
 */
export function fillQueryCode(url: string, tag: string, newValue?: string): string {
  if (!url.includes("?")) return url;
  try {
    const [path, query] = url.split("?");
    let queryParams = "";
    if (query.length) {
      query.split("&").map((item: string) => {
        const [key, value] = item.split("=");
        if (key !== tag) queryParams += `${key}=${value}&`;
        else if (newValue) queryParams += `${key}=${newValue}&`;
      });
    }
    queryParams = queryParams.substr(0, queryParams.length - 1);
    return `${path}?${queryParams}`;
  } catch (e) {
    console.error("removeQueryCode error:", e);
    return url;
  }
}

/**
 * @description: 查询用户账户信息
 */
export function findIsAccountExist() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise<any>((resolve, reject) => {
    isAccountExist()
      .then((res: any) => {
        resolve(res);
      })
      .catch(() => {
        reject();
      });
  });
}

/**
 * @description: 指定数据拼接成query形式
 * @param {Object} option
 * @return {String}
 */
export function packageQuery(option: Record<string, any>): string {
  const arr: Array<string> = Object.keys(option).reduce((pre: any, cur: string) => {
    pre.push(`${cur}=${option[cur] || ""}`);
    return pre;
  }, []);
  return arr.join("&");
}

/**
 * @description: 新页面下载文件
 * @param {any} options 页面携带参数
 * @param {string} uri 下载链接
 */
export function fileDownload(options: any, uri: string) {
  window.open(`${uri}?${packageQuery(options)}`);
}
