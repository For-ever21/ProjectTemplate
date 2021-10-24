import { CustomRoute } from "@/router/types";
const routes: Array<CustomRoute> = [
  {
    path: "/login",
    name: "login",
    component: (): any => import("@/modules/login/pages/index.vue"),
    meta: {
      hidden: true,
      title: "登录",
      needLogin: false,
    },
  },
  {
    path: "/password/reset",
    name: "resetPassword",
    component: (): any => import("@/modules/login/pages/resetPassword.vue"),
    meta: {
      hidden: true,
      title: "修改密码",
      needLogin: false,
    },
  },
];
export default routes;
