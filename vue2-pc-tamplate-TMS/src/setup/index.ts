import Vue from "vue";

import svgInstall from "@/icons";

import { getToken } from "@/utils/auth";
import loginStore from "@/modules/login/store";
import appStore from "@/store/modules/app";
import { deviceEnum } from "@/types/enums";

import ElementUI from "element-ui";
import { Button, Swipe, SwipeItem, Image as VanImage, Lazyload, Popup, Overlay } from "vant";
import "@/assets/theme/index.css";
import "@/styles/index.less"; // 全局通用样式

export default (): void => {
  // 1*全局注册 svg 组件
  svgInstall();
  // 注册 element-ui
  Vue.use(ElementUI, {
    size: "small",
  });
  // 2*注册 vant-ui
  Vue.use(Button);
  Vue.use(Swipe);
  Vue.use(SwipeItem);
  Vue.use(VanImage);
  Vue.use(Lazyload);
  Vue.use(Popup);
  Vue.use(Overlay);
  // 3*本地环境 调试
  if (process.env.NODE_ENV == "development") {
    Vue.config.devtools = true; // vue 调试工具开启
    // 提供本地token
    if (!getToken()) {
      // 调用登录接口，获取token
      loginStore.tokenAction();
    }
  }
  // 4* 获取设备环境
  appStore.deviceEnvAction(deviceEnum.PC);
};
