import { AppModule } from "@/store";
import { BASE_URL } from "@/config/link";
import { getBaiduLocationApi, getAppLocationApi } from "@/utils";
import { ICityObj } from "@/store/types";

/**
 * @description 跳转登录 url
 * @param path 完整的跳转路径 或者 相对health.sina.cn/zt的相对路径
 * @param params 查询参数
 */
export function getLoginUrl(path: string = "", params = {}) {
  // 登录埋点的数据
  let logData = "";
  if (Object.keys(params).length) {
    Object.keys(params).forEach((key: any) => {
      logData += `&${key}=${encodeURIComponent((params as any)[key])}`;
    });
  }
  const query = `refer=${encodeURIComponent(path)}${logData}`;
  const loginUrl = `${BASE_URL}/customer-login/?${query}`;
  return loginUrl;
}

/**
 * @description 用户登录操作(!!!仅限客户端操作)
 * @param refer 完整的跳转路径 或者 相对health.sina.cn/zt的相对路径
 * @param params 查询参数
 */
export function goLogin(refer = window.location.href, params = {}) {
  // 登录埋点的数据
  let logData = "";
  if (Object.keys(params).length) {
    Object.keys(params).forEach((key: any) => {
      logData += `&${key}=${encodeURIComponent((params as any)[key])}`;
    });
  }
  const query = `refer=${encodeURIComponent(refer)}${logData}`;
  const url = `${BASE_URL}/customer-login/?${query}`;
  localStorage.setItem("nn-refer", url);
  // 统一跳转一个公共登录页
  window.location.href = url;
}

/**
 * @description 区分本地环境 进行对应的地址跳转
 */
export function getLocalUrl(path: string = "/") {
  const offline = process.env.NODE_ENV === "development";
  return offline ? `http://localhost:56005/${path}` : `${BASE_URL}${path}`;
}

/**
 * @description 更新当前定位信息
 */
export async function updateLocation() {
  let locationData: ICityObj;
  try {
    if (AppModule.browser === "iwenApp") {
      // 使用app定位
      locationData = getAppLocationApi();
    } else {
      // 使用百度定位
      locationData = await getBaiduLocationApi();
    }
    AppModule.SetLocationCity(locationData);
    AppModule.SetGpsEnable(true);
  } catch (error) {
    // 设置gps为false，定位开启失败
    AppModule.SetGpsEnable(false);
  }
}
