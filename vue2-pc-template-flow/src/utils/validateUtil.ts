/* ----------- 常用正则校验方法------------- */

/**
 * @description 判断是否是有效得url地址
 * @param url
 */
export function isValidURL(url: string): boolean {
  const reg = /^(https|http|ftp|rtsp|mms):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @description 判断是否是一个有效的邮箱
 * @param email
 */
export function isValidEmail(email: string): boolean {
  const reg = /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/;
  return reg.test(email);
}

/**
 * @description 手机号(宽松)验证
 * @param value
 */
export function isValidMobileS(value: string): boolean {
  const reg = /^(?:1)\d{10}$/;
  return reg.test(value);
}

/**
 * @description 手机号(严谨)验证
 * @param value
 */
export function isValidMobileF(value: string): boolean {
  const reg = /^1((3[d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[d])|(9[1,8,9]))d{8}$/;
  return reg.test(value);
}
