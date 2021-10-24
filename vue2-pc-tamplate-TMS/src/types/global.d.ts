declare interface Window {
  $appVersion: string | undefined;
  document: {
    currentStyle: object;
  };
}

declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production";
    readonly BASE_URL: string;
    readonly VUE_APP_API: string;
    readonly VUE_APP_CURRENTMODE: string;
    readonly VUE_APP_ROUTE_BASE: string;
    readonly VUE_APP_TITLE: string;
    readonly VUE_APP_OPENNProgress: 0 | 1;
    readonly VUE_APP_ADMIN_WENWO: string;
    readonly VUE_APP_CURRENT_MODE:
      | "develop"
      | "test"
      | "rebuild-dev"
      | "rebuild-test"
      | "uat"
      | "production";
  }
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare let process: NodeJS.Process;

declare type Nullable<T> = T | null;

declare type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

declare type TargetContext = "_self" | "_blank";

declare module "nprogress";

declare module "window";

declare module "document";

declare module "good-storage";

declare module "HTMLElement";

declare module "js-cookie";
