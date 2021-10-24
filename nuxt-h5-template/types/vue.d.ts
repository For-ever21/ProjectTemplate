import Vue from "vue";
import VueRouter, { Route } from "vue-router/types";

import { Store } from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    $logger: {
      emit: (eventName: string, data: any) => void;
      on: (eventName: string, callback: (data: any) => void) => void;
      once: (eventName: string, callback: (data: any) => void) => void;
      startPageReadListen: () => void;
      stopPageReadListen: () => void;
    };
    $router: VueRouter;
    $route: Route;
    $store: Store<any>;
  }
}
