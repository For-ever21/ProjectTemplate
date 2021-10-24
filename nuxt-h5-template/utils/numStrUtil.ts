/* ----------- number 和 string 操作的工具函数 ------------- */

/**
 * @description 数字格式化 转中文
 * @param val 需要转换的数字
 * @example like 10000 => 1.0万
 */
export function numberFormat(val: string | number): string | number {
  const num = Number(val);

  if (num > 9999) return (num / 10000).toFixed(1) + "万";
  else if (num > 99999999) return (num / 100000000).toFixed(2) + "亿";

  return num;
}

/**
 * @description 数字格式化 转英文
 * @param num 需要转换的数字
 * @param digits 保留几位小数 默认为 2
 * @example like 10000 => 10k
 */
export function numberFormatEn(num: number, digits: number = 2) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * @description 对数字number 进行四舍五入，保留deci位小数位
 * @param number 需要转换的数字
 * @param deci 默认为2
 * @example like 2.654 => 2.65
 */
export function roundNum(number: number, deci = 2) {
  return Math.floor(number * Math.pow(10, deci)) / Math.pow(10, deci);
}

/**
 * @description 去除字符串前后空格
 * @param str
 */
export function trim(str: string): string {
  if (str) {
    return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "");
  }
  return str;
}

/**
 * @description 删除 .号 的字符串后缀
 * @param str
 * @example like baidu.com => baidu
 */
export function delStuffix(str: string = "") {
  const index = str.indexOf(".");
  return index === -1 ? str : str.slice(0, index);
}

/**
 * @description 将字符串按固定长度截断并添加尾缀
 * @param {string} str
 * @param {number} limitLen
 * @param {string} Abbreviations 默认值为：···
 * @example like 这是一个字符串 => 这是一个字...
 */
export function cutStr(str: string, limitLen: number, Abbreviations: string) {
  if (str) {
    if (isNaN(limitLen)) {
      limitLen = 8;
    }
    if (!Abbreviations) {
      Abbreviations = "···";
    }
    if (str.length > limitLen) {
      str = str.substr(0, limitLen) + Abbreviations;
    }
  }
  return str;
}
