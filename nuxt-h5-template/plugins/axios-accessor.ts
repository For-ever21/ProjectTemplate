import { Plugin } from "@nuxt/types";
import { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { initializeAxios, initializeCookies } from "@/utils/request/api";
import { UserModule } from "@/store";
import { getLoginUrl, getLocalUrl } from "@/utils/iwen";
import { ResultEnum } from "@/enums/httpEnum";
import qs from "qs";
import { Toast } from "vant";
import { getToken } from "@/utils/auth";

const accessor: Plugin = ({ redirect, route, app: { $axios, $cookies } }) => {
  initializeAxios($axios);
  initializeCookies($cookies);
  $axios.onRequest((config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (config.url && config.url.includes("/midauth/")) {
        config.headers.Authorization = `Bearer user=${token}`;
      } else {
        config.headers.token = token;
        config.headers.Authorization = token;
      }
    }
    let configData = {};
    if (config.method === "post") {
      configData = config.data;
      if (config.headers["Content-Type"] === "application/x-www-form-urlencoded") {
        configData = qs.stringify(configData);
      }
      config.data = configData;
    }
    config.headers["Cache-Control"] = "no-cache";

    return config;
  });
  $axios.onError((error: AxiosError<any>) => {
    let errMsg = "";
    const { code, message } = error || {};
    // const msg: string = response?.data?.error?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    const status: any = error?.response?.status;
    console.log(`${error.config.url}: axios调用接口返回错误`, code);
    try {
      if (code === "ECONNABORTED" && message.includes("timeout")) {
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
      case 403:
        errMsg = "拒绝访问";
        break;

      case 404:
        errMsg = "未找到该页面接口";
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
    Toast(errMsg);
  });
  // response拦截器，数据返回后，你可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      // 需要token才能获取数据的接口，但访问不触发跳转登录的白名单
      const whiteList = ["/midauth/userInfo/findDetail", "/patient/h5/message/messageCount"];
      const res = response.data;
      const url: string = response.config.url || "";
      if (res.status === ResultEnum.SUCCESS) {
        return res.data;
      } else if (res.status === ResultEnum.Unauthorized && whiteList.includes(url)) {
        UserModule.ResetToken(); // 清空浏览器的token
        return Promise.reject(res);
      } else {
        if (res.status === ResultEnum.Unauthorized) {
          // token失效，或者未登录情况，进行二次登录
          const loginUrl = getLoginUrl(getLocalUrl(route.fullPath));
          return redirect(loginUrl);
        }
        console.log(`${url}: axios调用接口返回错误`, res);
        return Promise.reject(res);
      }
    },
    (err: AxiosError<any>) => {
      return Promise.reject(err);
    }
  );
};

export default accessor;
