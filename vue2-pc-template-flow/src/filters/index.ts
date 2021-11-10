/*
 * @Author         : Qiao
 * @Date           : 2021-03-19 17:30:17
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 13:47:08
 * @FilePath       : /src/filters/index.ts
 * @Description    : 公共过滤器
 */

import Vue from "vue";

/**
 * @description: 日期格式化
 * @filterName capitalize
 * @param {string} value 需要转换的日期
 * @param {string} f     指定转换后的格式  默认为 yyyy年MM月dd日 hh:mm:SS
 * @return {string}
 */
Vue.filter("capitalize", (value: string, f: string): string => {
  if (!f) f = "yyyy年MM月dd日 hh:mm:SS";
  if (!value) return "";
  const elem: any = new Date(value);
  const o: any = {
    "M+": elem.getMonth() + 1, //月
    "d+": elem.getDate(), //d日
    "h+": elem.getHours(), //时
    "m+": elem.getMinutes(), //分
    "s+": elem.getSeconds(), //秒
    "q+": Math.floor((elem.getMonth() + 3) / 3),
    S: elem.getMilliseconds(),
  };
  if (/(y+)/.test(f))
    f = f.replace(RegExp.$1, (elem.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(f))
      f = f.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return f;
});

/**
 * @description: 数字格式化   eq: 1234567 => 1,234,567
 * @filterName seperate
 * @param {string ｜ number} num
 * @param {string} fill 无数据且不为0时候填充内容 不传默认为0
 * @return {string}
 */
Vue.filter("seperate", (num: string | number, fill: string): string | number => {
  if (!num && num != 0) return fill || "0";
  return num.toString().replace(new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g"), ",");
});

/**
 * @description: 金额格式化   eq: 1234567 => 1,234,567.00
 * @filterName seperate
 * @param {string ｜ number} value
 * @param {string} fill  无数据且不为0时候填充内容 不传默认为0.00
 * @return {string}
 */
Vue.filter("moneyFormat", (value: string | number, fill: string): any => {
  if (!value && value != 0) return fill || "0.00";
  value = value.toString();
  if (!value.split(".")[1]) {
    return value.replace(/\d{1,3}(?=(\d{3})+(?:\.\d{1,2})?$)/g, "$&,") + ".00";
  } else if (value.split(".")[1].length == 1) {
    return value.replace(/\d{1,3}(?=(\d{3})+(?:\.\d{1,2})?$)/g, "$&,") + "0";
  } else if (value.split(".")[1].length == 2) {
    return value.replace(/\d{1,3}(?=(\d{3})+(?:\.\d{1,2})?$)/g, "$&,");
  }
});

/**
 * @description: 数字格式化   eq: 1234567 => 1,234,567 没有数据会返回 --
 * @filterName seperate
 * @param {string ｜ number} num
 * @return {string}
 */
Vue.filter("seperateNull", (num: string | number): string | number => {
  if (!num) return "--";
  return num.toString().replace(new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g"), ",");
});

/**
 * @description: Table内 无数据的cell 展示 “--”
 * @filterName emptyTextFilter
 */
Vue.filter("emptyTextFilter", (val: string | number) => {
  if (val === undefined || val === null || val === "") {
    return "--";
  } else {
    return val;
  }
});

export default {};
