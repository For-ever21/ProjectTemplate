import VueRouter, { Route } from "vue-router";

import { Store } from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    // 神策打点
    $logger: {
      emit: (eventName: string, data: any) => void;
      on: (eventName: string, callback: (data: any) => void) => void;
      once: (eventName: string, callback: (data: any) => void) => void;
      startPageReadListen: () => void;
      stopPageReadListen: () => void;
    };
    getInstance: () => any;
    $router: VueRouter;
    $route: Route;
    $store: Store<any>;
  }
}
