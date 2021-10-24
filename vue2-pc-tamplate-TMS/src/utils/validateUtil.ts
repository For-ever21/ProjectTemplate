/**
 * @description 判断是否是有效得url地址
 * @param url
 */
export function isValidURL(url: string): boolean {
  const reg =
    /^(https|http|ftp|rtsp|mms):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 *
 * 判断是否是一个有效的邮箱
 * @export
 * @param {string} eamil
 * @return {*}  {boolean}
 */
export function isValidEmail(eamil: string): boolean {
  const reg = /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/;
  return reg.test(eamil);
}
