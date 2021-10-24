import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { NuxtCookies } from "cookie-universal-nuxt";
import { ContentTypeEnum } from "@/enums/httpEnum";
import LRU from "lru-cache";
import md5 from "md5";

import { Result, UploadFileParams } from "./types";

const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false, // 忽略证书认证
});

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance;

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance;
}

// eslint-disable-next-line import/no-mutable-exports
let $cookies: NuxtCookies;

export function initializeCookies(cookiesInstance: NuxtCookies) {
  $cookies = cookiesInstance;
}

// 常规请求
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    $axios
      .request<any, AxiosResponse<Result>>({
        ...config,
        httpsAgent: agent,
        timeout: 15 * 1000,
      })
      .then((res: AxiosResponse<Result>) => {
        resolve((res as unknown) as Promise<T>);
      })
      .catch((e: AxiosError) => {
        reject(e);
      });
  });
}

const cacheOptions = {
  // 最大缓存个数
  max: 1000,
  // 缓存周期
  maxAge: 1000 * 60 * 20, // 20 分钟的缓存
};

const cache = new LRU(cacheOptions);

// 常规get请求---那些不涉及用户信息和实时性要求不高的接口进行缓存
export function requestCache<T>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    const key = md5(config.url + JSON.stringify(config.params));
    // 只在服务端进行缓存
    if (process.server && cache.get(key)) {
      // 命中缓存
      return Promise.resolve(cache.get(key));
    }
    console.log("【缓存接口】key值=====", cache.get(key));
    // console.log("缓存接口key", cache.has(key));

    $axios
      .request<any, AxiosResponse<Result>>({
        ...config,
        httpsAgent: agent,
        method: "GET",
      })
      .then((res: AxiosResponse<Result>) => {
        // 只在服务端进行缓存
        if (process.server) {
          console.log("【缓存接口set】", key);
          cache.set(key, res);
        }
        resolve((res as unknown) as Promise<T>);
      })
      .catch((e: AxiosError) => {
        reject(e);
      });
  });
}

// 文件上传
export function uploadFile<T>(config: AxiosRequestConfig, params: UploadFileParams): Promise<T> {
  const formData = new window.FormData();
  if (params.data) {
    Object.keys(params.data).forEach((key) => {
      if (!params.data) return;
      const value = params.data[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
        return;
      }

      formData.append(key, params.data[key]);
    });
  }

  formData.append(params.name || "file", params.file, params.filename);
  return request<T>({
    ...config,
    method: "POST",
    data: formData,
    headers: {
      "Content-type": ContentTypeEnum.FORM_DATA,
      ignoreCancelToken: true,
    },
  });
}

// x-www-form-urlencoded 方式提交
export function requestUrlencoded<T>(config: AxiosRequestConfig): Promise<T> {
  return request<T>({
    ...config,
    headers: {
      "Content-Type": ContentTypeEnum.FORM_URLENCODED,
      ignoreCancelToken: true,
    },
  });
}

export { $cookies, $axios };
