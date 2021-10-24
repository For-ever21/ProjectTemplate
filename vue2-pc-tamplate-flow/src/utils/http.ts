import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { ResultEnum } from "@/enums/httpEnum";
import { Message } from "element-ui";
import router from "@/router";
import { getToken } from "@/utils/auth";
import store from "@/store";
/**
 * http请求工具类
 * 请求拦截器 负责将客户端标识token值存储并放置在头部提交给服务端
 * 响应拦截器 负责全局处理业务请求的网络或者业务错误
 */

const apiHost: string = process.env.VUE_APP_API;
const ztApiHost: string = process.env.VUE_APP_ZT_API;

// 创建axios的实例
const service = axios.create({
  // baseURL: apiHost,
  timeout: 10000, // 超时时间
});

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (store.getters.getterToken) {
      config.headers["token"] = getToken(); // 业务端 校验
      config.headers["Authorization"] = `Bearer business=${getToken()}`; // 中台 校验
    }
    return config;
  },
  (err: any) => {
    Promise.reject(err);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, message, status } = response.data;
    if (status === ResultEnum.SUCCESS) {
      return data;
    } else if (status === ResultEnum.Unauthorized) {
      // 重置token，重新登录
      store.dispatch("resetToken").then(() => {
        location.reload();
      });
    } else if (status >= ResultEnum.SpecialStart && status <= ResultEnum.SpecialEnd) {
      return Promise.reject(response.data);
    } else {
      (Message as any).closeAll();
      Message.error(message || "Error");
      return Promise.reject(new Error(message || "Error"));
    }
  },
  /**
   * @description: 响应错误处理
   */
  (error: any) => {
    let errMsg = "";
    const { code, message } = error || {};
    // const msg: string = response?.data?.error?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    const status: number = error?.response?.status;
    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMsg = "接口请求超时！";
      }
      if (err?.includes("Network Error")) {
        // 跨域相关
        errMsg = "网络错误！";
      }
    } catch (error) {
      throw new Error(error);
    }
    switch (status) {
      case 401:
        errMsg = "登录状态失效，请重新登录";
        router.push("/login");
        break;
      case 403:
        errMsg = "拒绝访问";
        break;

      case 408:
        errMsg = "请求超时";
        break;

      case 500:
        errMsg = "服务器内部错误";
        break;

      case 501:
        errMsg = "服务未实现";
        break;

      case 502:
        errMsg = "网关错误";
        break;

      case 503:
        errMsg = "服务不可用";
        break;

      case 504:
        errMsg = "网关超时";
        break;

      case 505:
        errMsg = "HTTP版本不受支持";
        break;

      default:
        break;
    }

    Message.error(errMsg);
    return Promise.reject(errMsg);
  }
);

export interface Result<T = any> {
  status: number;
  message: string;
  data: T;
}

export default {
  post<T>(url: string, data?: any): Promise<T> {
    let apiUrl = "";
    if (url.startsWith("/midauth")) {
      apiUrl = ztApiHost + url;
    } else {
      apiUrl = apiHost + url;
    }
    return new Promise((resolve, reject) => {
      service({
        method: "post",
        url: apiUrl,
        data,
      })
        .then((res: AxiosResponse<Result>) => {
          resolve((res as unknown) as Promise<T>);
        })
        .catch((e: AxiosError) => {
          reject(e);
        });
    });
  },
  get<T>(url: string, params?: any): Promise<T> {
    let apiUrl = "";
    if (url.startsWith("/midauth")) {
      apiUrl = ztApiHost + url;
    } else {
      apiUrl = apiHost + url;
    }
    return new Promise((resolve, reject) => {
      service({
        method: "get",
        url: apiUrl,
        params,
      })
        .then((res: AxiosResponse<Result>) => {
          resolve((res as unknown) as Promise<T>);
        })
        .catch((e: AxiosError) => {
          reject(e);
        });
    });
  },
};
