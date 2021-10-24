import { CustomRoute } from "@//router/types";
const routes: Array<CustomRoute> = [
  {
    path: "/",
    name: "index",
    redirect: "/template",
    component: () => import("@/modules/project/layout/index.vue"),
    children: [
      {
        path: "template",
        component: () => import("@/modules/project/pages/template/index.vue"),
        name: "template",
        meta: { title: "模板", icon: "template", affix: true },
      },
    ],
  },
  {
    path: "/comp",
    name: "comp",
    component: () => import("@/modules/project/layout/index.vue"),
    redirect: "/comp/index",
    meta: { title: "组件", icon: "component" },
    children: [
      {
        path: "index",
        name: "compIndex",
        component: () => import("@/modules/project/pages/comp/index.vue"),
        meta: {
          title: "组件操作",
        },
      },
    ],
  },
];
export default routes;
