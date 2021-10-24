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

/**
 * @description 身份证号验证
 * @param value
 */
export function isValidIdCard(value: string): boolean {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(value);
}

/**
 * @description 护照验证
 * @param value
 * @example
 * 护照
 * 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
 * 样本： 141234567, G12345678, P123456
 */
export function isValidPassport(value: string): boolean {
  const reg = /^[a-zA-Z]{5,17}$/;
  const reg2 = /^[a-zA-Z0-9]{5,17}$/;
  return reg.test(value) || reg2.test(value);
}

/**
 * @description 港澳台身份证验证
 * @param value
 * @example
 * 港澳居民来往内地通行证
 * 规则： H/M + 10位或6位数字
 * 样本： H1234567890
 * -------------------
 * 台湾居民来往大陆通行证
 * 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
 * 样本： 12345678 或 1234567890B
 */
export function isValidHKMacaoTaiwan(value: string): boolean {
  const reg = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; // 港澳通行证格式
  const reg2 = /^[0-9]{8}$/; // 台湾通行证
  const reg3 = /^[0-9]{10}$/; // 台湾通行证
  return reg.test(value) || reg2.test(value) || reg3.test(value);
}

/**
 * @description 军工证验证
 * @param value
 * @example
 * 军官证
 * 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
 * 样本： 军字第2001988号, 士字第P011816X号
 */
export function isValidOfficerCard(value: string): boolean {
  const reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
  return reg.test(value);
}
