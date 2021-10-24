import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./filters";
import directives from "./directive";
import elementUi from "element-ui";
import VueCropper from "vue-cropper"; // 图片裁剪
import { Component } from "vue-property-decorator";

import "./assets/theme/index.css";
import "./styles/index.less";

Vue.use(VueCropper);
import "animate.css";

import fullpage from "v-fullpage";
Vue.use(fullpage);

Vue.use(elementUi, {
  // size: "medium",
});
Vue.config.productionTip = false;

Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave", "beforeRouteUpdate"]);

if (process.env.NODE_ENV === "development") {
  Vue.config.devtools = true; // vue 调试工具开启
  const { mockXHR } = require("../mock");
  mockXHR();
}

new Vue({
  router,
  store,
  directives,
  render: (h) => h(App),
}).$mount("#app");
