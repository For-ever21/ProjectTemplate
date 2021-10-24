import { Store, ActionTree } from "vuex/types";
import { getModule } from "vuex-module-decorators";
import App from "@/store/modules/app";
import User from "@/store/modules/user";
import { getToken } from "@/utils/auth";

interface RootState {
  appModule: App;
  userModule: User;
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit() {
    // 想要将服务端的一些数据传到客户端，可以通过这个获取保存在状态中，客户端再从状态里取
    // 初始化时的全局任务
    if (getToken()) {
      await UserModule.SetToken();
    }
  },
};

// eslint-disable-next-line import/no-mutable-exports
let AppModule: App, UserModule: User;

function initialiseStores(store: Store<any>): void {
  AppModule = getModule(App, store);
  UserModule = getModule(User, store);
}

export { initialiseStores, AppModule, UserModule };
