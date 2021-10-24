import {
  createDEL,
  createGET,
  createPATCH,
  createPUT,
  createPOST,
  createService,
  RequestConfig,
  extend,
} from "@wenwo-public/http-util-js";
export { IResponse, RequestConfig } from "@wenwo-public/http-util-js";
import httpConfig from "./httpConfig";
const qs = require("qs");
const { service, request } = createService(httpConfig);

export const instance = service;
export const get = createGET(request);
export const del = createDEL(request);
export const patch = createPATCH(request);
export const post = createPOST(request);
export const put = createPUT(request);

//根据基础的四个请求方法自由扩展封装常用其他常用请求方法。
export const postBlob = function <T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const option: RequestConfig = {
    responseType: "blob",
  };
  extend(option, config);
  return post(url, data, option);
};
export const getBlob = function <T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const option: RequestConfig = {
    responseType: "blob",
  };
  extend(option, config);
  return get(url, data, option);
};

export const getForm = function <T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const option = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  extend(option, config);
  return get(url, qs.stringify(data || {}), option);
};

export const postForm = function <T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const option = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  extend(option, config);
  return post(url, qs.stringify(data || {}), option);
};

export const getMutilData = function <T>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const option = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  extend(option, config);
  return get(url, data, option);
};

export const postMutilData = function <T>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const option = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  extend(option, config);
  return post(url, data, option);
};
