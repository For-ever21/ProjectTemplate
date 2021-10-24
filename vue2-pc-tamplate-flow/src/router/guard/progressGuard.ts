import VueRouter from "vue-router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
const openNProgress = true;

export function createProgressGuard(router: VueRouter): void {
  if (openNProgress) {
    // NProgress.inc(0.1);
    // NProgress.configure({ easing: 'ease', speed: 200, showSpinner: false });
    router.beforeEach((to, from, next) => {
      NProgress.start();
      next();
    });

    router.afterEach(() => {
      NProgress.done();
    });
  }
}
