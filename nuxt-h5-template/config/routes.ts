// import { RouteRecord } from "vue-router";
// eslint-disable-next-line import/named
import { RouteConfig, RedirectOption, NavigationGuard, Route } from "vue-router/types";
import { PathToRegexpOptions } from "vue-router/types/router";
// import Vue, { ComponentOptions, AsyncComponent } from "vue";
type RoutePropsFunction = (route: Route) => Object;
interface RouteConfigSingleView {
  path: string;
  name?: string;
  children?: RouteConfig[];
  redirect?: RedirectOption;
  alias?: string | string[];
  meta?: any;
  beforeEnter?: NavigationGuard;
  caseSensitive?: boolean;
  pathToRegexpOptions?: PathToRegexpOptions;
  component?: any;
  props?: boolean | Object | RoutePropsFunction;
}

export function generateRoutes(resolve: any) {
  const routes: Array<RouteConfigSingleView> = [
    // 搜索-结果
    {
      path: "/iw/search/result",
      name: "searchResult",
      component: resolve("pages/iw/search/result.vue"),
    },
    // 搜索-关键词
    {
      path: "/iw/hot/:id",
      name: "hot_id",
      component: resolve("pages/iw/search/result.vue"),
    },
    // 我的地址-新增
    {
      path: "/iw/mine/address/add",
      name: "address_add",
      component: resolve("pages/iw/mine/address/info.vue"),
    },
    // 我的地址-编辑
    {
      path: "/iw/mine/address/:id",
      name: "address_id",
      component: resolve("pages/iw/mine/address/info.vue"),
    },
    // 就诊人管理-新增
    {
      path: "/iw/mine/familyMember/create",
      name: "familyMemberCreate",
      component: resolve("pages/iw/mine/familyMember/form.vue"),
    },
    // 就诊人管理-编辑
    {
      path: "/iw/mine/familyMember/:id",
      name: "familyMemberUpdate",
      component: resolve("pages/iw/mine/familyMember/form.vue"),
    },
    // iw 首页重定向
    {
      path: "/",
      name: "index",
      component: resolve("pages/iw/index.vue"),
    },
  ];
  return routes;
}
