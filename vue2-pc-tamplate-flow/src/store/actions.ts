import { ActionTree } from "vuex";
// import { RouteConfig } from "vue-router";
import { RootState } from "./types";

import { login, logout, getUserInfo } from "@/modules/login/api/index";
import {
  compile,
  setToken,
  removeToken,
  setrefreshToken,
  removerefreshToken,
  getrefreshToken,
  removereUserInfo,
  setUserInfo,
} from "@/utils/auth";
import { resetRouter } from "@/router";
import { LoginRes } from "@/modules/login/api/model";

/**
 * @description 通过 meta.role 判断是否有权限
 * @param roles
 * @param route
 */
// function hasPermission(authCodeList, route: RouteConfig[]) {
//   if (route.meta && route.meta.roles) {
//     return roles.some((role) => route.meta.roles.includes(role));
//   } else {
//     return true;
//   }
// }

/**
 * @description 筛选出 authCode 匹配上的路由
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = [];

//   routes.forEach((route) => {
//     const tmp = { ...route };
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles);
//       }
//       res.push(tmp);
//     }
//   });

//   return res;
// }

const actions: ActionTree<RootState, RootState> = {
  // 用户登录
  login({ commit }, payload: Record<string, any>) {
    const { account, checkInfo, imgCode, type } = payload;
    return new Promise<void>((resolve, reject) => {
      login({
        account: account.trim(),
        checkInfo: type == "02" ? checkInfo : compile(checkInfo),
        configId: Number(process.env.VUE_APP_LOGIN_CONFIG_ID),
        source: "pc",
        type: type || "01",
        userType: "business",
        imgCode,
        loginSource: "",
      })
        .then((res: LoginRes) => {
          commit("SET_TOKEN", res.token);
          commit("SET_REFRESH_TOKEN", res.refreshToken);
          setToken(res.token);
          setrefreshToken(res.refreshToken);
          resolve();
        })
        .catch((error: unknown) => {
          reject(error);
        });
    });
  },

  // 用户登出
  logout({ commit }) {
    return new Promise<void>((resolve, reject) => {
      const refreshToken = getrefreshToken();
      logout({ refreshToken, source: "pc" })
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_REFRESH_TOKEN", "");
          removeToken();
          removerefreshToken();
          removereUserInfo();
          resetRouter();
          resolve();
        })
        .catch((error: unknown) => {
          reject(error);
        });
    });
  },

  // 获取用户信息
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((response: any) => {
          commit("SET_USER_INFO", response);
          setUserInfo(response);
          resolve(response);
        })
        .catch((error: unknown) => {
          reject(error);
        });
    });
  },

  // 清空token, refreshToken
  resetToken({ commit }) {
    return new Promise<void>((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_REFRESH_TOKEN", "");
      removeToken();
      removerefreshToken();
      resolve();
    });
  },
  // 生成路由
  // generateRoutes({ commit }, roles) {
  //   return new Promise((resolve) => {
  //     let accessedRoutes;
  //     if (roles.includes("admin")) {
  //       accessedRoutes = asyncRoutes || [];
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
  //     }
  //     commit("SET_ROUTES", accessedRoutes);
  //     resolve(accessedRoutes);
  //   });
  // },
};

export default actions;
