/* ----------- 判断数据类型的工具函数 ------------- */

const toString = Object.prototype.toString;

/**
 * @description 是否是 Primitive 类型
 */
export function isPrimitive(value: unknown) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "symbol" ||
    typeof value === "boolean" ||
    typeof value === "function"
  );
}

/**
 * @description 是否是 Primitive 类型
 */
export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description 是否是对象
 */
export function isObject(val: unknown): boolean {
  return val !== null && is(val, "Object");
}

/**
 * @description 是否是 Date 类型
 */
export function isDate(val: unknown): boolean {
  return is(val, "Date");
}

/**
 * @description 是否为 Null
 */
export function isNull(val: unknown): boolean {
  return val === null;
}

/**
 * @description 是否是一个 Promise 对象
 */
export function isPromise(val: any): boolean {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * @description 是否是一个数组
 */
export function isArray(val: any): boolean {
  return val && Array.isArray(val);
}

/**
 * @description 是否是 string 类型
 */
export function isString(val: unknown): boolean {
  return is(val, "String");
}

/**
 * @description 是否是 number 类型
 */
export function isNumber(val: unknown): boolean {
  return is(val, "Number");
}

/**
 * @description 是否是 函数类型
 */
export function isFunction(val: unknown): boolean {
  return is(val, "Function");
}

/**
 * @description 是否是 Boolean 类型
 */
export function isBoolean(val: unknown): boolean {
  return is(val, "Boolean");
}

/**
 * @description 是否是正则表达式
 */
export function isRegExp(val: unknown): boolean {
  return is(val, "RegExp");
}

/**
 * @description 是否是 window 对象
 */
export const isWindow = (val: unknown): boolean => {
  return typeof window !== "undefined" && is(val, "Window");
};

/**
 * @description 是否是一个 HtmlElement 元素
 */
export const isElement = (val: any): boolean => {
  return isObject(val) && !!val.tagName;
};

/**
 * @description 是否是在服务器环境下
 */
export const isServer = typeof window === "undefined";

/**
 * @description 是否是在客户端环境下
 */
export const isClient = typeof window !== "undefined";

/**
 * @description 是否是一个 img 标签
 */
export function isImageDom(o: Element): boolean {
  return o && ["IMAGE", "IMG"].includes(o.tagName);
}

/**
 * @description 是否是一个 textarea 标签
 */
export const isTextarea = (element: Element | null): element is HTMLTextAreaElement => {
  return element !== null && element.tagName.toLowerCase() === "textarea";
};

/**
 * @description 是否是为空
 */
export function isEmpty(obj: unknown): boolean {
  return obj === undefined || obj === null || obj === "";
}
