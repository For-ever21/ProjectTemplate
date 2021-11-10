import { RootState } from "./types";
import { getToken, getrefreshToken, getUserInfo } from "@/utils/auth";

const state: RootState = {
  token: getToken(),
  refreshToken: getrefreshToken(),
  userInfo: getUserInfo(),
  routes: [],
  addRoutes: [],
};

export default state;
