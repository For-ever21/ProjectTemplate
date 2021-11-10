import { VuexModule, getModule, Module, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { loginApi } from "@/modules/login/api";
import { getToken, setToken, getUserName } from "@/utils/auth";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "login",
})
class Login extends VuexModule {
  public token = getToken(); // token
  public userName = getUserName(); // username

  // getter
  get getterToken() {
    return this.token;
  }
  get getterUserName() {
    return this.userName;
  }

  @Mutation
  commitToken(data: string): void {
    this.token = data;
  }

  @Action
  public async tokenAction(): Promise<void> {
    return new Promise((resolve, reject) => {
      const params = {
        dataJson: JSON.stringify({ userName: "15986616910", password: "Aa123456" }),
      };
      loginApi(params)
        .then((response) => {
          this.commitToken(response.token);
          setToken(response.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

// 使用getModule: 对类型安全的访问
const loginStore = getModule<Login>(Login);
export default loginStore;
