import VueRouter, { Route } from "vue-router";
import store from "@/store";
import { Message } from "element-ui";
import { getToken, getUserInfo } from "@/utils/auth"; // get token from cookie

const whiteList = ["/login", "/auth-redirect", "/", "/password/reset"]; // 鉴权路由 白名单

export function createPermisstionGuard(router: VueRouter): void {
  router.beforeEach(async (to: Route, from: Route, next) => {
    const hasToken = getToken();
    const { userId } = getUserInfo();
    if (hasToken) {
      if (to.path === "/login") {
        // 已经登录，走登录后的首页
        next({ path: "/home" });
      } else {
        try {
          // 获取用户信息
          if (!userId) await store.dispatch("getUserInfo");

          // TODO: 通过后台数据返回 可访问的路由表数据
          // const accessRoutes = await store.dispatch("generateRoutes");

          // 动态加入可访问路由表 add accessible routes
          // router.addRoutes((accessRoutes as unknown) as RouteRecordRaw);

          // hack 兼容处理 addRoutes 留下的内存溢出的问题
          // 设置 replace 为 true, 浏览器导航不会留下记录
          // { ...to, replace: true }

          next();
        } catch (error) {
          // 删除token，重新跳转到登录页
          await store.dispatch("resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.fullPath}`);
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        // 白名单内的地址，直接通过
        next();
      } else {
        // 判断没有权限，进入登录页
        next(`/login?redirect=${to.fullPath}`);
      }
    }
  });
}
