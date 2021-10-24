import { CustomRoute } from "@/router/types";
import Layout from "@/modules/layout/index.vue";
const routes: Array<CustomRoute> = [
  {
    path: "/account",
    name: "account",
    component: Layout,
    redirect: "/account",
    meta: {
      title: "账户",
    },
    children: [
      {
        path: "/account",
        name: "accountIndex",
        component: (): any => import("@/modules/account/pages/index.vue"),
        meta: {
          hidden: true,
          title: "账户",
          needLogin: true,
        },
      },
    ],
  },
];
export default routes;
