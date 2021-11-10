import { VuexModule, getModule, Module, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { deviceEnum } from "@/types/enums";

// dynamic: true: 动态创建动态模块,即new Vuex.Store({})里面不用注册的.空着就行,
// store,当前模块注册到store上.也可以写在getModule上,即getModule(AppStore,store)
@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "app",
})
class App extends VuexModule {
  public device = deviceEnum.Mobile;

  // getter
  get getDeviceEnv() {
    return this.device;
  }

  @Mutation
  commitDeviceEnv(data: deviceEnum): void {
    this.device = data;
  }

  @Action
  public async deviceEnvAction(data: deviceEnum): Promise<void> {
    this.commitDeviceEnv(data);
  }
}

// 使用getModule: 对类型安全的访问
const appStore = getModule<App>(App);
export default appStore;
