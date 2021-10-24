/**
 * @description 应用设备类型
 * android: 安卓
 * ios: 苹果
 * desktop: 桌面应用
 * mobile: 移动应用
 */

declare type Device = "android" | "ios" | "desktop" | "mobile";

/**
 * @description 访问浏览器类型
 * weixin- 微信浏览器访问
 * weibo- 微博浏览器访问
 * qq- qq浏览器访问
 * alipay - 支付宝环境内置浏览器
 * iwenApp - 爱问健康app内部webview
 * hapApp: 快应用
 * browser: 自带浏览器
 * miniProgram: 微信小程序内部webview
 */
declare type Browser = "weixin" | "weibo" | "qq" | "alipay" | "iwenApp" | "hapApp" | "browser";

/**
 * @description 项目运行环境
 * dev 开发环境
 * test 测试环境
 * rebuild-dev 重构开发环境
 * rebuild-test 重构测试环境
 * uat 预发布环境
 * production -生产环境
 */
declare type Env = "dev" | "test" | "rebuild-dev" | "rebuild-test" | "uat" | "production";

declare interface Window {
  $sentry: AnyObject;
  $appVersion: string | undefined;
  $systemVersion: string | undefined;
  _hmt: Array<object>;
  BMap: AnyObject;
  iwenJSNativeBridge: {
    openApp: (params: string, isToDownload?: boolean) => void;
    goBack: () => void;
  };
}
declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production";
    readonly ENV_NAME: Env;
  }
}

declare module "aiwen-logger";

declare module "vue-content-loading";

declare module "vue-picture-preview";

declare module "md5";

declare module "lru-cache";
