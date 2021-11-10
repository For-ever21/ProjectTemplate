import VueRouter from "vue-router";
import type { Route } from "vue-router";
import projectStore from "@/modules/project/store";
import { setDocumentTitle } from "@/utils/domUtil";
const outerList = ["/template", "/"]; // 排除校验路由，避免死循环
export function createGuard(router: VueRouter): void {
  /**开始路由 */
  router.beforeEach(async (to, from, next) => {
    if (projectStore.templateComp.length || outerList.includes(to.path)) {
      next();
    } else {
      // 如果不存在勾选的模板信息，返回模板选择页面
      next("/template");
    }
  });
  /**路由结束*/
  router.afterEach((to: Route) => {
    setDocumentTitle(to.meta?.title);
  });
}
