/* ----------- dom操作的工具函数 ------------- */

import { isWindow } from "./is";
import { trim } from "./numStrUtil";

const hasWindow = isWindow(null);
export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

/**
 * @description getBoundingClientRect 兼容写法 返回元素的大小及其相对于视口的位置
 * @param element
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

/**
 * @description 设置页面标题
 * @param title
 */
export function setDocumentTitle(title: string): void {
  document.title = title;
}

/**
 * @description 判断Dom是否存在该类名
 * @param el 选择元素
 * @param cls 类名名称
 */
export function hasClass(el: HTMLElement, cls: string): boolean {
  if (!el || !cls) return false;
  if (cls.includes(" ")) throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").includes(" " + cls + " ");
  }
}

/**
 * @description 为该dom元素增加类名
 * @param el 选择元素
 * @param cls 类名名称
 */
export function addClass(el: HTMLElement, cls: string): void {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/**
 * @description 为dom元素删除类名
 * @param el 选择元素
 * @param cls 类名名称
 */
export function removeClass(el: HTMLElement, cls: string): void {
  if (!el || !cls) return;
  const classes = cls.split(" ");
  let curClass = " " + el.className + " ";

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * @description 获取 dom 元素的 某个样式名称值
 * @param element 选择元素
 * @param styleName 样式名称
 */
export const getStyle = function(element: HTMLElement, styleName: string): string | null {
  if (hasWindow) return null;
  if (!element || !styleName) return null;
  // styleName = camelize(styleName);
  if (styleName === "float") {
    styleName = "cssFloat";
  }
  const styleObj = element.style as any;
  try {
    const style = styleObj[styleName];
    if (style) return style;
    const computed = (document.defaultView as any).getComputedStyle(element, "");
    return computed ? computed[styleName] : "";
  } catch (e) {
    return styleObj[styleName];
  }
};

/**
 * @description 设置 dom 元素的 某个样式的值
 * @param element 选择元素
 * @param styleName 样式名称
 * @param value 设置值
 */
export function setStyle(
  element: HTMLElement,
  styleName: CSSStyleDeclaration | string,
  value?: string
): void {
  if (!element || !styleName) return;

  if (styleName instanceof CSSStyleDeclaration) {
    Object.keys(styleName).forEach((prop) => {
      setStyle(element, prop, (styleName as any)[prop]);
    });
  } else {
    (element.style as any)[styleName] = value;
  }
}

/**
 * @description 删除 dom 元素的 某个样式的值
 * @param element 选择元素
 * @param styleName 样式名称
 */
export function removeStyle(element: HTMLElement, style: CSSStyleDeclaration | string) {
  if (!element || !style) return;

  if (style instanceof CSSStyleDeclaration) {
    Object.keys(style).forEach((prop) => {
      setStyle(element, prop, "");
    });
  } else {
    setStyle(element, style, "");
  }
}

/**
 * @description 设置 dom 元素的 某个样式的值
 * @param element 选择元素
 * @param styleName 样式名称
 * @param value 设置值
 */
export function scrollIntoView(container: HTMLElement, selected: HTMLElement): void {
  if (hasWindow) return;

  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer !== null && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = (pointer as HTMLElement).offsetParent;
  }
  const top =
    selected.offsetTop + offsetParents.reduce((prev, curr) => prev + (curr as any).offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

/**
 * @description 获取当前元素的left、top偏移
 * @example
 *   left：元素最左侧距离文档左侧的距离
 *   top:元素最顶端距离文档顶端的距离
 *   right:元素最右侧距离文档右侧的距离
 *   bottom：元素最底端距离文档底端的距离
 *   rightIncludeBody：元素最左侧距离文档右侧的距离
 *   bottomIncludeBody：元素最底端距离文档最底部的距离
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;

  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;

  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

/**
 * @description 手动监听事件
 * @param element 选择元素
 * @param event 事件名
 * @param handler 事件手柄 处理
 */
export const on = function(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};

/**
 * @description 销毁监听事件
 * @param element 选择元素
 * @param event 事件名
 * @param handler 事件手柄 处理
 */
export const off = function(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
};

/**
 * @description 事件只处理一次
 * @param element 选择元素
 * @param event 事件名
 * @param fn 处理函数
 */
export const once = function(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function(this: any, ...args: any) {
    if (fn) {
      fn.apply(this, args);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};
