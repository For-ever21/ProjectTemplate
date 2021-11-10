import { GetterTree } from "vuex";
import { RootState } from "./types";

const getters: GetterTree<RootState, RootState> = {
  getterToken: (state) => state.token,
  getterRefreshToken: (state) => state.refreshToken,
  getterUserInfo: (state) => {
    if (state.userInfo) return state.userInfo;
    if (localStorage["flow_user_info"]) return JSON.parse(localStorage["flow_user_info"]);
    return {
      userId: "",
      userName: "",
      realName: "",
      sex: 0,
      email: "",
      phone: "",
      // 头像
      avatar: "",
      // 介绍
      desc: "",
    };
  },
};

export default getters;
