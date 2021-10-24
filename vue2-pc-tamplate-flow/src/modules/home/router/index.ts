import { CustomRoute } from "@/router/types";
import Layout from "@/modules/layout/index.vue";
const routes: Array<CustomRoute> = [
  {
    path: "/home",
    name: "home",
    component: Layout,
    meta: {
      hidden: true,
      title: "首页",
      needLogin: false,
    },
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "homeIndex",
        component: (): any => import("@/modules/home/pages/home.vue"),
        meta: {
          hidden: true,
          title: "",
          needLogin: true,
        },
      },
    ],
  },
  {
    path: "/",
    name: "index_home",
    component: (): any => import("@/modules/home/pages/index.vue"),
    meta: {
      hidden: true,
      title: "",
      needLogin: false,
    },
  },
];
export default routes;
