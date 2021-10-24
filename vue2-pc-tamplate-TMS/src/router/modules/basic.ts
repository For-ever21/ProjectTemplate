import { CustomRoute } from "@/router/types";
const routes: Array<CustomRoute> = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/modules/error-pages/404.vue"),
    hidden: true,
  },
  { path: "**", hidden: true, redirect: "/404", meta: { title: "404" } },
];
export default routes;
