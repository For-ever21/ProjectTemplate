export interface RootState {
  token: string | null;
  refreshToken: string | null;
  userInfo: UserInfo;
  routes: Array<any>;
  addRoutes: Array<any>;
}

export interface UserInfo {
  // 用户id
  userId: string | number;
  // 用户名
  userName: string;
  realName: string;
  sex: number;
  email: string;
  phone: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
