/* ----------- 常用的工具函数（不包含业务的通用方法） ------------- */

import { isEmpty, isPrimitive, isArray, isObject } from "@/utils/is";
import { Toast } from "vant";
import { ICityObj } from "@/store/types";

/**
 * @description 对对象中的每个元素自定义函数
 * @param obj 对象中
 * @param handler 函数 手柄事件
 * @param context this 上下文
 */
export function walkObj(obj: Record<string, any>, handler: Function, context?: any): void {
  if (isEmpty(obj)) {
    console.error("遍历的obj对象为空");
    return;
  }
  const keys = Object.keys(obj);
  const len = keys.length;
  let key = null;
  let value = null;
  for (let i = 0; i < len; i++) {
    key = keys[i];
    value = obj[key];
    if (!isEmpty(handler)) {
      const stop = handler.call(context, value, key, obj);
      if (stop) {
        return;
      }
    }
  }
}

/**
 * @description 对数组中的每个元素自定义函数
 * @param array 数组中
 * @param handler 函数 手柄事件
 * @param context this 上下文
 */
export function walkArray(array: Array<any>, handler: Function, context?: any): void {
  if (isEmpty(array)) {
    return;
  }
  const len = array.length;
  let value;
  for (let i = 0; i < len; i++) {
    value = array[i];
    if (!isEmpty(handler)) {
      const stop: boolean | void = handler.call(context, value, i, array);
      if (stop) {
        return;
      }
    }
  }
}

/**
 * @description 将含横杠字符串转成驼峰式字符串
 * @param {string} str
 * @example article-author-name => 驼峰式 articleAuthorName
 */
export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

/**
 * @description 将 source上所有属性复制一份到target上，
 * @param target
 * @param source
 * @param isInter
 * @param override 当有相同属性时会不会覆盖 默认为true
 * @example
 */
export function extend(
  target: Record<string, any>,
  source: Record<string, any>,
  isInter: boolean = false,
  override: boolean = true
) {
  if (!override) {
    if (isEmpty(source)) {
      return;
    }
  }
  if (isPrimitive(source)) {
    if (override || isEmpty(target)) {
      target = source;
    }
  } else if (isObject(source)) {
    if (isInter) {
      if (!isObject(target)) {
        target = {};
      }
    }
    for (const p in source) {
      if (Object.prototype.hasOwnProperty.call(source, p)) {
        target[p] = extend(target[p], source[p], true, override);
      }
    }
  } else if (isArray(source)) {
    if (isInter) {
      if (!isArray(target)) {
        target = [];
      }
    }
    const len = source.length;
    for (let i = 0; i < len; i++) {
      target[i] = extend(target[i], source[i], true, override);
    }
  }
  return target;
}

/**
 * @description 传入对象 转换成查询参数拼接到 url 上
 * @param baseUrl url
 * @param obj 传入对象
 * @example
 *  let obj = {a: '3', b: '4'}
 *  obj2UrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function obj2UrlParams(baseUrl: string, obj: Record<string, any>): string {
  let parameters = "";
  let url = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, "?") + parameters;
  }
  return url;
}

/**
 * @description 将 url 上的查询参数 转换成对象
 * @param url
 * @example
 *  let url = www.baidu.com?a=3&b=4
 *  obj2UrlParams(url)
 *  ==> {a: '3', b: '4'}
 */
export function urlParams2Obj(url: string) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj: Record<string, any> = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @description: 深合并 合并对象 而不覆盖
 * @param src 源对象
 * @param target 目标对象
 */
export function deepMerge(src: Record<string, any>, target: Record<string, any>) {
  let key: string;
  for (key in target) {
    src[key] =
      src[key] && src[key].toString() === "[object Object]"
        ? deepMerge(src[key], target[key])
        : (src[key] = target[key]);
  }
  return src;
}

/**
 * @description: 根据数组中某个对象值去重
 */
export function unique<T = any>(arr: T[], key: string): T[] {
  const map = new Map();
  return arr.filter((item) => {
    const _item = item as any;
    return !map.has(_item[key]) && map.set(_item[key], 1);
  });
}

/**
 * @description: es6数组去重复
 */
export function es6Unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * @description: 获取定位信息-浏览器定位
 * @return Promise 函数
 */
export function getBrowserLocationApi() {
  return new Promise((resolve, reject) => {
    const err = "定位失败";
    if (!navigator.geolocation) {
      reject(err);
    }
    function success(position: any) {
      const data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      resolve(data);
    }

    function error(error: any) {
      reject(err);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("定位失败,用户拒绝请求地理定位");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("定位失败,位置信息是不可用");
          break;
        case error.TIMEOUT:
          console.error("定位失败,请求获取用户位置超时");
          break;
        case error.UNKNOWN_ERROR:
          console.error("定位失败,定位系统失效");
          break;
      }
    }

    navigator.geolocation.getCurrentPosition(success, error);
  });
}

/**
 * @description: 获取当前定位信息-百度定位
 */
export function getBaiduLocationApi(): Promise<ICityObj> {
  return new Promise((resolve, reject) => {
    const err = "定位失败";
    if (!window.BMap) {
      reject(err);
    }
    // 引入百度地图
    // const BMap = require("BMap");
    const geolocation = new window.BMap.Geolocation();
    geolocation.getCurrentPosition(
      (r: any) => {
        // console.log(r);
        if (geolocation.getStatus() === 0) {
          // 获取经纬度
          const point = new window.BMap.Point(r.point.lng, r.point.lat);
          const geoc = new window.BMap.Geocoder();
          // 获取逆地址解析
          geoc.getLocation(point, (rs: any) => {
            const addComp = rs.addressComponents;
            const res = {
              longitude: r.point.lng,
              latitude: r.point.lat,
              province: addComp.province,
              cityname: addComp.city,
              district: addComp.district,
              street: addComp.street,
              streetNumber: addComp.streetNumber,
            };
            resolve(res);
          });
        } else {
          Toast.fail("定位失败，请检查是否开启手机定位功能");
          reject(err);
        }
      },
      { enableHighAccuracy: true }
    );
  });
}
/**
 * @description: 获取当前定位信息-app定位
 * @summary TODO: 还未联调 APP 定位，返回默认经纬度
 */
export function getAppLocationApi() {
  return {
    latitude: 39.5426,
    longitude: 116.2329,
  };
}

/**
 * @description 复制文本到剪贴
 */
export function copyToClipBoard(value: string) {
  // 如果内容是界面的一个元素，可以直接读取元素getElementById() 这里是因为界面没有input元素，所以自己创建一个元素来作为载体把内容复制到剪贴板
  const inputEle = document.createElement("input");
  // 判断并控制整个HTML文档可编辑
  if (!(document.designMode === "on")) {
    document.designMode = "on";
  }
  inputEle.setAttribute("readonly", "readonly"); // 防止复制时屏幕下方会出现白屏抖动
  inputEle.setAttribute("value", value); // 把复制的内容赋给input的内容
  // inputEle.value = value
  document.body.appendChild(inputEle); // 把input元素绑定到document,不然操作不到
  // 判断元素是否能被选中
  if (inputEle && inputEle.select) {
    inputEle.select();
    try {
      inputEle.setSelectionRange(0, 9999);
      // 复制文本
      document.execCommand("copy");
      Toast(`复制成功`);
    } catch (err) {
      Toast("由于浏览器安全设置，不支持自动复制, 请手动复制");
    }
    inputEle.blur(); // 失去焦点
    inputEle.style.display = "none"; // 隐藏元素
    document.body.removeChild(inputEle); // 删除元素
    document.designMode = "off"; // 文档设为不可编辑,否则界面的其他元素可能被影响
  }
}

/**
 * @description: 删除或者替换url指定query参数
 * @param {string} url 需要处理的链接
 * @param {string} tag 需要替换的参数名
 * @param {string} newValue 需要替换的参数值 不传则表示去除该参数
 * @return {string} 处理之后的链接
 */
export function fillQueryCode(url: string, tag: string, newValue?: string): string {
  if (!url.includes("?")) return url;
  if (!url.includes(tag) && newValue) return url + `&${tag}=${newValue}`;
  try {
    const [path, query] = url.split("?");
    let queryParams: string = "";
    if (query.length) {
      query.split("&").map((item: string) => {
        const [key, value] = item.split("=");
        if (key !== tag) queryParams += `${key}=${value}&`;
        else if (key === tag && newValue) queryParams += `${tag}=${newValue}&`;
      });
    }
    queryParams = queryParams.substr(0, queryParams.length - 1);
    return `${path}?${queryParams}`;
  } catch (e) {
    console.error("removeQueryCode error:", e);
    return url;
  }
}
