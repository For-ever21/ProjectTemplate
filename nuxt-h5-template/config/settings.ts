/**
 * @description 项目基础设置
 */

import { ISettings } from "./types";

// 自定义设置
const settings: ISettings = {
  title: "爱问健康-一站式医疗健康在线咨询服务平台",
  description: "新浪健康，严肃医疗资讯平台，健康无忧",
  keywords: "新浪健康,爱问社区,社区",
  progressLoadingColor: "#664AE1",
  progressFailedColor: "red",
  publicPath: process.env.NODE_ENV === "development" ? "/_nuxt_1/" : "/_nuxt_1/", // TODO: 后续使用cdn加载
  errorLog: ["production"],
  serverPort: 56005, // 本地服务端口
};

export default settings;
