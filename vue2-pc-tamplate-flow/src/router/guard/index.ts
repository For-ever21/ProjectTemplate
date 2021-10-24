import VueRouter from "vue-router";

import { createPermisstionGuard } from "./permisstionGuard";
import { createProgressGuard } from "./progressGuard";

export function createGuard(router: VueRouter): void {
  /** 生成 顶部进度条 */
  createProgressGuard(router);

  /** 校验路由权限 */
  createPermisstionGuard(router);
}
