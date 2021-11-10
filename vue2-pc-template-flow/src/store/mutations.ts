import { MutationTree } from "vuex";
import { RootState } from "./types";

const mutations: MutationTree<RootState> = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.token = refreshToken;
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  // SET_ROUTES: (state, routes) => {
  //   state.addRoutes = routes;
  //   state.routes = constantRoutes.concat(routes);
  // },
};
export default mutations;
