import { CustomRoute } from "@/router/types";
import Layout from "@/modules/layout/index.vue";
const routes: Array<CustomRoute> = [
  {
    path: "/wax",
    name: "wax",
    component: Layout,
    redirect: "/wax/advPlan",
    meta: {
      title: "推广",
    },
    children: [
      {
        path: "advSeries",
        name: "advSeries",
        component: () => import("@/modules/wax/pages/advSeries/index.vue"),
        meta: {
          title: "广告系列",
        },
      },
      {
        path: "advPlan",
        name: "advPlan",
        component: () => import("@/modules/wax/pages/advPlan/index.vue"),
        meta: {
          hidden: true,
          title: "广告计划",
          needLogin: true,
        },
      },
      {
        path: "/wax/advPlan/add",
        name: "addAdvPlan",
        component: () => import("@/modules/wax/pages/advPlan/add.vue"),
        meta: {
          hidden: true,
          title: "创建广告计划",
          needLogin: true,
        },
      },
      {
        path: "/wax/advPlan/:id",
        name: "advPlanEdit",
        component: () => import("@/modules/wax/pages/advPlan/add.vue"),
        meta: {
          hidden: true,
          title: "编辑广告计划",
          needLogin: true,
        },
      },
      {
        path: "advCreative",
        name: "advCreative",
        component: () => import("@/modules/wax/pages/advCreative/index.vue"),
        meta: {
          title: "广告创意",
        },
      },
      {
        path: "advCreativeAdd",
        name: "advCreativeAdd",
        component: () => import("@/modules/wax/pages/advCreative/add.vue"),
        meta: {
          title: "广告创意-编辑",
        },
      },
    ],
  },
];
export default routes;
