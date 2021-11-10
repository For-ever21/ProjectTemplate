import Layout from "@/modules/layout/index.vue";

import { CustomRoute } from "@/router/types";
export const errorRoutes: Array<CustomRoute> = [
  {
    path: "/error",
    component: Layout,
    redirect: "noRedirect",
    name: "error",
    meta: {
      hidden: true,
      title: "错误页面",
      needLogin: true,
    },
    children: [
      {
        path: "404",
        name: "404",
        component: () => import("@/modules/error-pages/404.vue"),
        meta: {
          hidden: true,
          title: "404",
          needLogin: false,
        },
      },
    ],
  },
  { path: "*", redirect: "/error/404", meta: { title: "404", needLogin: false, hidden: true } },
];
