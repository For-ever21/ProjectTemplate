import Vue from "vue";
import VueRouter from "vue-router";
import { CustomRoute } from "./types";
import { createGuard } from "./guard/";
import { errorRoutes } from "./error";
Vue.use(VueRouter);

/** 实现自动加载 @modules 下的模块里的静态 router 文件 */
const loadModulesRouter = require.context(
  "../modules",
  true,
  /\.\/[a-zA-Z0-9_-]+\/router\/.+\.ts$/
);

/** 实现自动加载 @modules 下的模块里的异步动态 asyncRouter 文件 */
const loadModulesAsyncRouter = require.context(
  "../modules",
  true,
  /\.\/[a-zA-Z0-9_-]+\/asyncRouter\/.+\.ts$/
);
function getFileRoutes(fn: any): Array<CustomRoute> {
  let routes: Array<CustomRoute> = [];

  routes = fn.keys().reduce((routes: Array<CustomRoute>, modulePath: string) => {
    const value = fn(modulePath);
    routes = routes.concat(value.default);
    return routes;
  }, routes);
  return routes;
}
// 存储 静态路由
const constantRoutes = getFileRoutes(loadModulesRouter);

// 存储 异步路由
export const asyncRoutes = getFileRoutes(loadModulesAsyncRouter);

// 存储 error 页面路由

const createRouter = () =>
  new VueRouter({
    mode: "history",
    routes: constantRoutes.concat(errorRoutes),
    base: "./",
    scrollBehavior(): { x: number; y: number } {
      return { x: 0, y: 0 };
    },
  });

const router = createRouter();

createGuard(router);

export function resetRouter() {
  const newRouter = createRouter();
  // matcher 即新的routes就会替换老的routes, 其实就是replaceRoutes()的含义
  // （但是官方没有提供这个API）
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
