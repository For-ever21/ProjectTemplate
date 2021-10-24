/* ----------- 日期时间操作的工具函数 ------------- */

import dayjs from "dayjs";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
const DATE_FORMAT = "YYYY-MM-DD";

/**
 * @description 格式化为 YYYY-MM-DD HH:mm 格式
 * @param date
 * @example 转换为 "YYYY-MM-DD HH:mm" 日期-时间字符串
 */
export function formatToDateTime(date: dayjs.ConfigType): string {
  return dayjs(date).format(DATE_TIME_FORMAT);
}

/**
 * @description 格式化为 YYYY-MM-DD 格式
 * @param date
 * @example 转换为 "YYYY-MM-DD" 日期字符串
 */
export function formatToDate(date: dayjs.ConfigType): string {
  return dayjs(date).format(DATE_FORMAT);
}

/**
 * @description 与当前时间进行对比 转换为 多少日期 前
 * @param str 传入的时间戳或日期格式
 * @example like 2021-03-18 15:00:00 => 3天前
 */
export const formatAgo = (str: string | number) => {
  if (!str) return "";
  const date = new Date(Number(str));
  const time = new Date().getTime() - date.getTime(); // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return "";
  } else if (time / 1000 < 30) {
    return "刚刚";
  } else if (time / 1000 < 60) {
    return parseInt(String(time / 1000)) + "秒前";
  } else if (time / 60000 < 60) {
    return parseInt(String(time / 60000)) + "分钟前";
  } else if (time / 3600000 < 24) {
    return parseInt(String(time / 3600000)) + "小时前";
  } else if (time / 86400000 < 31) {
    return parseInt(String(time / 86400000)) + "天前";
  } else if (time / 2592000000 < 12) {
    return parseInt(String(time / 2592000000)) + "月前";
  } else {
    return parseInt(String(time / 31536000000)) + "年前";
  }
};

export const dateUtil = dayjs;
