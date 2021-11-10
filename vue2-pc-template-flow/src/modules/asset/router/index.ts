import { CustomRoute } from "@/router/types";
import Layout from "@/modules/layout/index.vue";
const routes: Array<CustomRoute> = [
  {
    path: "/assets",
    name: "assets",
    component: Layout,
    redirect: "/assets/crowdPack",
    meta: {
      title: "资产",
    },
    children: [
      {
        path: "crowdPack",
        name: "crowdPack",
        component: () => import("@/modules/asset/pages/crowdPack.vue"),
        meta: {
          title: "自定义人群包管理",
        },
      },
      {
        path: "crowdPackCreate",
        name: "crowdPackCreate",
        component: () => import("@/modules/asset/pages/crowdPackForm.vue"),
        meta: {
          title: "新建人群包",
        },
      },
      {
        path: "crowdPackDetail/:id(\\d+)",
        name: "crowdPackDetail",
        component: () => import("@/modules/asset/pages/crowdPackForm.vue"),
        meta: {
          title: "人群包详情",
        },
      },
    ],
  },
];
export default routes;
