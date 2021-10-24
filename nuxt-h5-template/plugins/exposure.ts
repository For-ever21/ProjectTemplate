import AiwenLogger from "aiwen-logger";

// polyfill 暂时不考虑ie兼容
// import "intersection-observer";

// 节流的时间，默认是100ms
(IntersectionObserver.prototype as any).THROTTLE_TIMEOUT = 300;

export default class Exposure {
  dotDataArr: Array<any>;
  maxNum: number;
  // _observer 观察者的集合
  _observer: any;
  _timer: number;
  dotType: string;

  constructor(maxNum = 20) {
    // 当前收集的  尚未上报的数据  也就是已经进入视窗的DOM节点的数据
    this.dotDataArr = [];
    this.maxNum = maxNum;
    this._timer = 0;
    // 全局只会实例化一次Exposure类
    this.init();
  }

  init() {
    const self = this;
    // 把浏览器localStorage里面的剩余数据打完
    this.dotFromLocalStorage();
    // 注册客户端webview的关闭生命钩子事件
    // this.beforeLeaveWebview();

    this._observer = new IntersectionObserver(
      function(entries, _observer) {
        entries.forEach((entry) => {
          // 每一个item进入视窗时都会触发的
          if (entry.isIntersecting) {
            // 清除当前定时器
            clearTimeout(self._timer);
            // 数据直接放DOM上  :data-dot="埋点数据"
            const id = (entry.target.attributes as any)["data-dot"].value; // 埋点数据id
            const index = (entry.target.attributes as any)["data-index"].value; // 埋点数据序号index
            // 把收集到的数据添加进待上报的数据数组中
            const ctm = [id, index];
            self.dotDataArr.push(ctm);
            // 收集到该item的数据后，取消对该item的DOM观察
            self._observer.unobserve(entry.target);
            // 超过一定数量打点，打完点会删除这一批
            if (self.dotDataArr.length >= self.maxNum) {
              self.dot();
            } else {
              self.storeIntoLocalstorage(self.dotDataArr);
              if (self.dotDataArr.length > 0) {
                // 只要有新的ctm进来  接下来如果没增加  自动2秒后打
                self._timer = window.setTimeout(function() {
                  self.dot();
                }, 2000);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // 不一定非得全部露出来  这个阈值可以小一点点
      }
    );
  }

  // 每个商品都会会通过全局唯一的Exposure的实例来执行该add方法,将自己添加进观察者中
  add(entry: any) {
    this._observer && this._observer.observe(entry.el);
    this.dotType = entry.val;
  }

  dot() {
    // 同时删除这批打点的ctms
    const dotDataArr = this.dotDataArr.splice(0, this.maxNum);
    DotData(this.dotType, dotDataArr);
    // // 打完点，也顺便更新一下localStorage
    // this.storeIntoLocalstorage(this.dotDataArr);
  }

  storeIntoLocalstorage(dotDataArr: any) {
    if (dotDataArr.length) {
      // 。。。 存进localStorage中，具体什么格式的字符串自行定义就好
      // console.log("storeIntoLocalstorage", dotDataArr);
      const str = JSON.stringify(dotDataArr);
      window.localStorage.setItem("dotDataArr", str);
    }
  }

  dotFromLocalStorage() {
    const ctmsStr = window.localStorage.getItem("dotDataArr") || "";
    let ctmsArray = [];
    try {
      ctmsArray = JSON.parse(ctmsStr);
    } catch (error) {
      ctmsArray = [];
    }
    // console.log(ctmsArray, "ctmsArray");
    if (ctmsArray.length) {
      // 。。。如果有数据，就上报打点
      DotData(this.dotType, ctmsArray);
    }
  }
  // 在app壳子交互
  // beforeLeaveWebview() {
  //   let win: any = window;
  //   // 自行跟客户端童鞋约定该钩子的实现就好
  //   injectEvent("webviewWillDisappear", () => {
  //     if (this.dotDataArr.length > 0) {
  //       // DotData(this.dotDataArr);
  //     }
  //   });
  // }
}

function DotData(type: string, dotDataArr: Array<any>) {
  const params: Record<string, any> = {};
  params.information_flow_sort_list = dotDataArr.map((x) => x[0]);
  params.target_list = dotDataArr.map((x) => x[1]);
  if (type === "comty") {
    params.information_flow_position = "找社区页面";
  } else if (type === "doctor") {
    params.information_flow_position = "找名医页面";
  } else {
    params.information_flow_position = "C端首页";
    params.search_channel = type; // 栏目类别
  }
  // console.log("DotData", params);
  AiwenLogger.emit("c_information_flow_exposure", params);
  window.localStorage.removeItem("dotDataArr");
}
