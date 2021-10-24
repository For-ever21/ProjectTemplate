/**
 * @description 左右滑动 scroll
 * @param scroller 滑动选择器
 * @param to 滑动距离
 * @param duration 滑动时长
 * @param callback 回调函数
 */
export const scrollLeftTo = (
  scroller: "document" | HTMLElement,
  to: number,
  duration?: number,
  callback?: () => void
): void => {
  const start = scroller === "document" ? positionLeft() : scroller.scrollLeft;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const durationE = duration || 500;
  const animateScroll = () => {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = easeInOutQuad(currentTime, start, change, durationE);
    // move the document.body
    scroller === "document" ? moveLeft(val) : (scroller.scrollLeft = val);
    // do the animation unless its over
    if (currentTime < durationE) {
      requestAnimFrame(animateScroll);
    } else if (callback && typeof callback === "function") {
      // the animation is done so lets callback
      callback();
    }
  };
  animateScroll();
};

/**
 * @description 上下滑动 scroll
 * @param scroller 滑动选择器
 * @param to 滑动距离
 * @param duration 滑动时长
 * @param callback 回调函数
 */
export const scrollTopTo = (
  scroller: any,
  to: number,
  duration?: number,
  callback?: () => void
): void => {
  const start = scroller === "document" ? positionTop() : scroller.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const durationE = duration || 500;
  const animateScroll = () => {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = easeInOutQuad(currentTime, start, change, durationE);
    // move the document.body
    scroller === "document" ? moveTop(val) : (scroller.scrollTop = val);
    // do the animation unless its over
    if (currentTime < durationE) {
      requestAnimFrame(animateScroll);
    } else if (callback && typeof callback === "function") {
      // the animation is done so lets callback
      callback();
    }
  };
  animateScroll();
};

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
let requestAnimFrame: any;
if (process.client) {
  requestAnimFrame = (() => {
    const cb = (callback: any) => {
      window.setTimeout(callback, 1000 / 60);
    };
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || cb;
  })();
}

// Because it's so fucking difficult to detect the scrolling element, just move them all
const moveLeft = (amount: number) => {
  document.documentElement.scrollLeft = amount;
  (document.body.parentNode as HTMLElement).scrollLeft = amount;
  document.body.scrollLeft = amount;
};

const positionLeft = () => {
  return (
    document.documentElement.scrollLeft ||
    (document.body.parentNode as HTMLElement).scrollLeft ||
    document.body.scrollLeft
  );
};

// Because it's so fucking difficult to detect the scrolling element, just move them all
const moveTop = (amount: number) => {
  document.documentElement.scrollTop = amount;
  (document.body.parentNode as HTMLElement).scrollTop = amount;
  document.body.scrollTop = amount;
};

const positionTop = () => {
  return (
    document.documentElement.scrollTop ||
    (document.body.parentNode as HTMLElement).scrollTop ||
    document.body.scrollTop
  );
};
