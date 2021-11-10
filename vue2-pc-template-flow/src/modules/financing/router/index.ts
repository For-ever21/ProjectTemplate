import { CustomRoute } from "@/router/types";
import Layout from "@/modules/layout/index.vue";
const routes: Array<CustomRoute> = [
  {
    path: "/financing",
    name: "financing",
    component: Layout,
    redirect: "/financing",
    meta: {
      title: "账户",
    },
    children: [
      {
        path: "/financing",
        name: "financingIndex",
        component: (): any => import("@/modules/financing/pages/index.vue"),
        meta: {
          hidden: true,
          title: "财务",
          needLogin: true,
        },
      },
    ],
  },
];
export default routes;
