// 百度统计 神策埋点 自定义埋点
import { Plugin } from "@nuxt/types";

import Vue from "vue";
import AiwenLogger from "aiwen-logger";
import { UserModule } from "@/store";
import Exposure from "./exposure";

const mtaPoint: Plugin = ({ app }: any) => {
  /* 每次路由变更时进行 pv 统计 */
  app.router.afterEach((to: any) => {
    try {
      if (process.client) {
        window._hmt = window._hmt || [];
        window._hmt.push(["_trackPageview", `${to.fullPath}`]);
      }
    } catch (error) {
      console.log(error);
    }
  });
  /* 神策打点初始化 */
  AiwenLogger.setPublicProperty({
    platformType: "Web(H5)",
    appName: "爱问健康(新浪健康患端)",
    isLogin() {
      return UserModule.isLogin;
    },
    partName: "用户端",
  });

  AiwenLogger.setConfig({
    server_url: `https://sensors.wenwo.com/sa?project=${
      process.env.ENV_NAME === "production" ? "production" : "default" // 除了生产环境，其他环境都走default
    }`,
    show_log: true,
    heatmap: {
      clickmap: "default",
      scroll_notice_map: "default",
      collect_tags: {
        div: true,
      },
    },
    is_track_single_page: true,
  });
  AiwenLogger.start();
  // exp就是那个全局唯一的实例
  const exp = new Exposure();
  // vue封装一个指令，每个使用了该指令的item都会自动add自身进观察者中
  Vue.directive("exp-dot", {
    bind(el, binding, _vnode) {
      exp.add({ el, val: binding.value });
    },
  });
  Vue.use(AiwenLogger);
};

export default mtaPoint;
