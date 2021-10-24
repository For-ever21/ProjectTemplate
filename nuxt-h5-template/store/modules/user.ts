import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { logout, getUserInfo } from "@/api/user/userService";
import { getToken, removeToken, getRefreshTokenStorage, setUserInfoStorage } from "@/utils/auth";

import { DeviceEnum } from "@/enums/baseEnum";
import { IUserInfoResponseData } from "@/api/user/userModel";

@Module({
  name: "modules/user",
  namespaced: true,
  stateFactory: true,
})
export default class App extends VuexModule {
  // state => 要public不然外面调用不到
  public token: string = "";
  public userInfo: IUserInfoResponseData | "" = "";

  public weixinId = ""; // 小程序微信id

  // getter
  public get username() {
    return this.userInfo && this.userInfo.userName;
  }

  public get userId() {
    return this.userInfo && this.userInfo.userId;
  }

  public get avatar() {
    return this.userInfo && this.userInfo.avatar;
  }

  public get isLogin() {
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  public SET_USERINFO_PHONE(phone: string) {
    this.userInfo = Object.assign(this.userInfo, { phone });
  }

  @Mutation
  private SET_USERINFO(userInfo: IUserInfoResponseData | "") {
    this.userInfo = userInfo || "";
    let userInfoStr = "";
    try {
      userInfoStr = JSON.stringify(userInfo);
    } catch (error) {
      userInfoStr = "";
    }
    setUserInfoStorage(userInfoStr);
  }

  @Action
  public SetToken() {
    this.SET_TOKEN(getToken());
  }

  @Action
  public async ResetToken() {
    await removeToken();
    this.SET_TOKEN("");
  }

  @Action
  public async GetUserInfo() {
    try {
      const res: IUserInfoResponseData = await getUserInfo();
      this.SET_USERINFO(res);
      if (process.client) {
        const AiwenLogger = require("aiwen-logger");
        AiwenLogger.login(this.userId);
      }
    } catch (e) {
      this.ResetToken();
      console.log("store/Action/GetUserInfo：获取用户信息失败", e);
    }
  }

  @Action
  public UpdateUserInfo(data: IUserInfoResponseData) {
    this.SET_USERINFO(data);
  }

  @Action
  public async LogOut() {
    try {
      const params = {
        refreshToken: getRefreshTokenStorage(),
        source: DeviceEnum.H5,
      };
      await logout(params);
      removeToken();
      this.SET_TOKEN("");
      this.SET_USERINFO("");
    } catch (e) {
      console.log(e);
    }
  }
}
