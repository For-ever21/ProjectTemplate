import { Context } from "@nuxt/types";
// import { UserModule } from "@/store";

export default function({ store, req }: Context) {
  const userAgent = process.server ? req.headers["user-agent"] : navigator.userAgent;
  // 给全局上下文添加一个属性来保存我们返回的匹配信息
  const device = getDevice(userAgent);
  const browser = getBrowser(userAgent);
  // 这里注入到store,部分页面需要判断机型请求不同的数据,
  // 没有用到的话可以移除
  store.dispatch("modules/app/SetDevice", device);
  store.dispatch("modules/app/SetBrowser", browser);
  // UserModule.SetToken();
  // 若是判断UA非移动端的,就在这里做处理了..
  // context.redirect(status,url) 这个可以重定向到外部网站
  // 若是内部访问可以直接用router对象push
  if (device === "desktop") {
    // 判断是pc环境
    // context.redirect(301, url);
  }
}

// 是否在微信浏览器环境
function isWechat(UA: string): boolean {
  return !!/MicroMessenger/i.test(UA);
}
// 是否在微博浏览器环境
function isWeibo(UA: string): boolean {
  return !!/Weibo/i.test(UA);
}
// 是否在 QQ 浏览器环境
function isQQ(UA: string): boolean {
  return !!/QQ/i.test(UA);
}

// 是否在移动应用
function isMoible(UA: string): boolean {
  return !!/(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(UA);
}

// 是否在ios浏览器
function isIOS(UA: string): boolean {
  return !!/iPhone|iPad|iPod/i.test(UA);
}

// 是否在安卓浏览器
function isAndroid(UA: string): boolean {
  return !!/Android/i.test(UA);
}

// 是否在新浪健康 快应用
function isHapApp(UA: string): boolean {
  return !!/com\.iask\.healthhap/i.test(UA);
}

// 是否在爱问user-app的 webview里
function isUserApp(UA: string): boolean {
  let flag = !!/\s{1}DSBRIDGE[\w.]+$/g.test(UA);
  if (!flag) {
    flag = UA.includes(`"clientType":"app"`);
  }
  return flag;
}

/**
 * @param {*} UA userAgent
 * @returns device: 应用设备类型
 */
function getDevice(UA: string | undefined): Device {
  if (!UA) return "desktop";
  if (isMoible(UA)) {
    if (isIOS(UA)) return "ios";
    if (isAndroid(UA)) return "android";
  }
  return "desktop";
}

/**
 * @param {*} UA userAgent
 * @returns Browser: 访问浏览器类型(微信/微博/qq)
 */
function getBrowser(UA: string | undefined): Browser {
  if (!UA) return "browser";
  if (isWechat(UA)) return "weixin";
  if (isWeibo(UA)) return "weibo";
  if (isQQ(UA)) return "qq";
  if (isHapApp(UA)) return "hapApp";
  if (isUserApp(UA)) return "iwenApp";
  return "browser";
}
